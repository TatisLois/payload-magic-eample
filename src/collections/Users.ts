import { CollectionConfig } from "payload/types";
import { strategy } from "../magic-strategy";
import { login } from "../endpoints";
export const users_slug = "users";

const Users: CollectionConfig = {
  slug: "users",
  admin: {
    useAsTitle: "email",
  },
  endpoints: [
    {
      path: login.route,
      method: login.method,
      handler: login.handler,
    },
  ],
  auth: {
    disableLocalStrategy: true,
    strategies: [
      {
        strategy: strategy,
        name: "magic",
      },
    ],
  },
  access: {
    admin: (args) => true,
    read: (args) => true,
    update: (args) => true,
    create: (args) => true,
    delete: (args) => true,
  },
  fields: [
    {
      name: "name",
      type: "text",
      required: true,
    },
    {
      name: "email",
      type: "email",
      required: true,
    },
  ],
};

export default Users;
