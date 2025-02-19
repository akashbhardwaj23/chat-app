export interface Messages {
    id : string;
    message : {
      userId : string;
      content : string;
      participant ? : string
    },
    createdAt : Date
  }