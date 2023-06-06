interface IUser {
  name: {
    firstName: string;
    lastName: string;
  };
  email: string;
  roles: string[];
  password: string;
}

export default IUser;
