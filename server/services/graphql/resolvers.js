import {
  getUsers,
  getUserInfo,
  executeSignUp,
  executeSignIn,
  executeChangePassword,
  executeUserUpdate,
} from "../../api/users";
import { getUserTypes } from "../../api/userTypes/";
const resolvers = {
  RootQuery: {
    async userInfo(root, args, context) {
      const creds = {
        access_token: args.access_token,
        token_type: args.token_type,
      };
      const user = await getUserInfo(creds);
      return user;
    },
    async users(root, args, context) {
      const creds = {
        access_token: args.access_token,
        token_type: args.token_type,
      };
      const users = await getUsers();
      return users.filter((user) => {
        if (args.email) {
          return user.email === args.email;
        }
        if (args.username) {
          return user.username === args.username;
        }
        return true;
      });
    },
    async userTypes(root, args, context) {
      const userTypes = await getUserTypes();
      return userTypes;
    },
  },
  RootMutation: {
    async signUp(root, { user }, context) {
      return await executeSignUp(user);
    },
    async signIn(root, { user }, context) {
      return await executeSignIn(user);
    },
    async changePassword(root, { user, context }) {
      return await executeChangePassword(user);
    },
    async userUpdate(root, { user }, context) {
      return await executeUserUpdate(user);
    },
  },
};

export default resolvers;
