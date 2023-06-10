interface IUser {
  name: {
    firstName: string;
    lastName: string;
  };
  email: string;
  roles: string[];
  freemius: {
    public_key: string;
    secret_key: string;
    id: number;
  };
  password: string;
}

export default IUser;
