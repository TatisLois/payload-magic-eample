import { buildConfig } from "payload/config";
import path from "path";
import Users from "./collections/Users";
import Login from "./components/Login";
const jwt = path.resolve(__dirname, "./jwt.ts");
const MagicLoginStrategy = path.resolve(__dirname, "./magic-strategy.ts");
const mockModule = path.resolve(__dirname, "mock-object.ts");

export default buildConfig({
  serverURL: "http://localhost:3000",
  admin: {
    user: Users.slug,
    components: {
      beforeLogin: [Login],
    },
    webpack: (config) => {
      const updatedConfiguration = {
        ...config,
        resolve: {
          ...(config.resolve || {}),

          alias: {
            ...(config.resolve.alias || {}),
            [MagicLoginStrategy]: mockModule,
            [jwt]: mockModule,
          },
        },
      };

      return updatedConfiguration;
    },
  },
  collections: [Users],
  typescript: {
    outputFile: path.resolve(__dirname, "payload-types.ts"),
  },
  graphQL: {
    schemaOutputFile: path.resolve(__dirname, "generated-schema.graphql"),
  },
});
