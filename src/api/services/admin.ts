import AdminBro from "admin-bro";
// @ts-ignore
import AdminBroExpress from "@admin-bro/express";
// @ts-ignore
import AdminBroMongoose from "@admin-bro/mongoose";

import { MemberModel, FeeBandModel } from "lib/clubDb/models";

AdminBro.registerAdapter(AdminBroMongoose);

const adminBro = new AdminBro({
    resources: [MemberModel, FeeBandModel],
    databases: [],
    rootPath: "/admin",
});

export default AdminBroExpress.buildRouter(adminBro);
