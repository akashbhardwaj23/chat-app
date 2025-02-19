import { Router } from "express";
import { RoomJoinInput } from "common/zod";
import { client } from "db/client";
import { authMiddleware } from "../middleware/auth";
import { Webhook } from "svix";

const router = Router();

// handled by clerk

// router.post("/signup", async (req, res) => {
//   const parsedData = SignUpInputs.safeParse(req.body);
//   if (!parsedData.success) {
//     res.status(411).json({
//       message: "Unauthorized",
//     });
//     return;
//   }

//   const hashedPassword = await bcrypt.hash(parsedData.data.password, 7);
//   console.log("after hashed password");
//   try {
//     console.log("before user");
//     const user = await client.user.create({
//       data: {
//         name: parsedData.data.name,
//         email: parsedData.data.email,
//         password: hashedPassword,
//         profilePicture: "",
//       },
//     });
//     console.log("after user");

//     const token = jwt.sign({ userId: user.id }, "secret");

//     console.log("after token");

//     res.json({
//       userId: user.id,
//       token,
//     });
//   } catch (error) {
//     console.log(error);
//     res.status(403).json({
//       message: "Unauthorized",
//     });
//   }
// });

// router.post("/signin", async (req, res) => {
//   const parsedData = SignInInputs.safeParse(req.body);
//   if (!parsedData.success) {
//     res.status(411).json({
//       message: "Unauthorized",
//     });
//     return;
//   }

//   const hashedPassword = await bcrypt.hash(parsedData.data.password, 7);

//   try {
//     const user = await client.user.findFirst({
//       where: {
//         email: parsedData.data.email,
//       },
//     });

//     if (!user) {
//       res.status(411).json({
//         message: "No User Found",
//       });
//       return;
//     }

//     if (user.password !== hashedPassword) {
//       res.status(411).json({
//         message: "Invalid Password",
//       });
//       return;
//     }

//     const token = jwt.sign({ userId: user.id }, "secret");

//     res.json({
//       userId: user.id,
//       token,
//     });
//   } catch (error) {
//     console.log(error);
//     res.status(403).json({
//       message: "Unauthorized",
//     });
//   }
// });

router.post("/create-room", authMiddleware, async (req, res) => {
  const parsedData = RoomJoinInput.safeParse(req.body);

  if (!parsedData.success) {
    res.status(411).json({
      message: "Unauthorized",
    });
    return;
  }

  console.log("here");
  try {
    const roomId = await client.$transaction(async (tx) => {
      const room = await tx.room.create({
        data: {
          name: parsedData.data.name,
          description: parsedData.data.description,
        },
      });

      console.log("RoomId is ", room.id);

      await tx.user.update({
        where: {
          clerkUserId: req.userId,
        },
        data: {
          roomId: room.id,
        },
      });

      return room.id;
    });

    console.log(roomId);
    console.log("after roomId");

    res.json({
      roomId,
    });
  } catch (error) {
    console.log(error);
  }
});

router.get("/previous-chat/:roomId", authMiddleware, async (req, res) => {
  const roomId = req.params.roomId;
  const chats = await client.chatMessage.findMany({
    where: {
      roomId,
    },
  });

  console.log("CHATS ", chats);
  const myChats = chats.map((chat) => {
    const content = JSON.parse(chat.message);
    return {
      id: chat.id,
      message: {
        userId: chat.userId,
        content: content.content,
      },
      createdAt: chat.createdAt,
    };
  });

  res.json({
    chats: myChats,
  });
});

router.get("/delete-room/:roomId", authMiddleware, async (req, res) => {
  const roomId = req.params.roomId;
  if (!roomId) {
    res.status(403).json({
      message: "No Room Id Found",
    });
    return;
  }

  try {
    const newRooms = await client.$transaction(async(tx) => {
        await tx.chatMessage.deleteMany({
          where : {
            roomId
          }
        })

        await tx.room.delete({
          where : {
            id : roomId
          }
        })
    })
    console.log(newRooms);
    res.json({
      message: "Room Deleted",
    });
  } catch (error) {
    console.log(error);
    res.status(403).json({
      message: "Prisma Error",
    });
  }
});

router.get("/rooms", authMiddleware, async (req, res) => {
  const rooms = await client.room.findMany({});
  console.log(rooms);
  res.json({
    rooms,
  });
});

router.post("/clerk-webhook", async (req, res) => {
  const wh = new Webhook(process.env.SIGNING_SECRET || "");
  console.log("Webhook created");
  // console.log(wh)
  const headers = req.headers;
  const payload = req.body;

  if (!process.env.SIGNING_SECRET) {
    throw new Error(
      "Error: Please add SIGNING_SECRET from Clerk Dashboard to .env"
    );
  }

  const svix_id = headers["svix-id"];
  const svix_timestamp = headers["svix-timestamp"];
  const svix_signature = headers["svix-signature"];

  //   console.log(svix_id);
  //   console.log(svix_timestamp);
  //   console.log(svix_signature);

  if (!svix_id || !svix_timestamp || !svix_signature) {
    return void res.status(400).json({
      success: false,
      message: "Error: Missing svix headers",
    });
  }

  let event: any;

  try {
    event = wh.verify(JSON.stringify(payload), {
      "svix-id": svix_id as string,
      "svix-timestamp": svix_timestamp as string,
      "svix-signature": svix_signature as string,
    });
  } catch (error: any) {
    console.log("Error: Could not verify webhook:", error.message);
    return void res.status(400).json({
      success: false,
      message: error.message,
    });
  }

  // const { id } = event.data
  const eventType = event.type;

  // console.log(id)
  // console.log(eventType)

  // console.log(event)

  switch (eventType) {
    case "user.created": {
      const user = await client.user.create({
        data: {
          name: event.data.first_name,
          email: event.data.email_addresses[0].email_address,
          clerkUserId: event.data.id,
          profilePicture: event.data.image_url,
        },
      });

      res.json({
        message: "user created",
        userId: user.id,
      });
      break;
    }
    case "user.updated": {
      await client.user.update({
        where: {
          clerkUserId: event.data.id,
        },
        data: {
          name: event.data.first_name,
          email: event.data.email_addresses[0].email_address,
          profilePicture: event.data.image_url,
        },
      });
      res.json({
        message: "user updated",
      });
      break;
    }
    case "user.deleted": {
      try {
        await client.user.delete({
          where: {
            clerkUserId: event.data.id,
          },
        });
        res.json({
          message: "user deleted",
        });
      } catch (error) {
        res.json({
          message: "user not found",
        });
      }
      break;
    }
    default: {
      res.json({
        message: "unknown event",
      });
    }
  }
});

export default router;
