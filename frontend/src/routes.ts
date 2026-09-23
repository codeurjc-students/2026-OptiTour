import { type RouteConfig, layout, route } from "@react-router/dev/routes";

export default [
    layout("routes/home.tsx", [
        route("/", "routes/index/index.tsx"),
        route("/signup", "routes/signup/signup.tsx"),
        route("/tourdetail", "routes/tour-detail/tour-detail.tsx"),
        route("/poidetail", "routes/point-of-interest-detail/point-of-interest-detail.tsx"),
        route("/unauthorized", "routes/unauthorized/unauthorized.tsx")
    ]),
    layout("layouts/profile-layout.tsx", [
        route("/profile", "routes/my-profile/my-profile.tsx"),
        route("/profile/friends", "routes/my-profile/my-friends.tsx"),
        route("/profile/tours", "routes/my-profile/my-tours.tsx"),
        route("/profile/groups", "routes/my-profile/my-groups.tsx"),
        route("/profile/notifications", "routes/my-profile/my-notifications.tsx"),
        route("/profile/payments", "routes/my-profile/my-payments.tsx"),
        route("/profile/edit", "routes/my-profile/edit-profile.tsx")
    ]),
    layout("layouts/admin-layout.tsx", [
        route("/admin/users", "routes/admin/user-management.tsx"),
        route("/admin/poi", "routes/admin/poi-management.tsx"),
        route("/admin/billing", "routes/admin/billing.tsx"),
        route("/admin/profile", "routes/admin/admin-profile.tsx"),
        route("/admin/notifications", "routes/admin/admin-notifications.tsx"),
        route("/admin/create", "routes/admin/create-admin-account.tsx"),
        route("/admin/addpoi", "routes/admin/create-poi.tsx"),
        route("/admin/tours", "routes/admin/tour-management.tsx")
    ]),
    layout("layouts/protected-layout.tsx", [
        route("/route-builder", "routes/route-builder/route-builder.tsx"),
    ]),
    route("/login", "routes/login/login.tsx")
] satisfies RouteConfig;