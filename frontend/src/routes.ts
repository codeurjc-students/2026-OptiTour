import { type RouteConfig, layout, route } from "@react-router/dev/routes";

export default [
    layout("routes/home.tsx", [
        route("/", "routes/Index/Index.tsx"),
        route("/signup", "routes/Signup/Signup.tsx"),
        route("/tourdetail", "routes/TourDetail/TourDetail.tsx"),
        route("/poidetail", "routes/PointOfInterestDetail/PointOfInterestDetail.tsx"),
        route("/route-builder", "routes/RouteBuilder/RouteBuilder.tsx")
    ]),
    layout("layouts/ProfileLayout.tsx", [
        route("/profile", "routes/MyProfile/MyProfile.tsx"),
        route("/profile/friends", "routes/MyProfile/MyFriends.tsx"),
        route("/profile/tours", "routes/MyProfile/MyTours.tsx"),
        route("/profile/groups", "routes/MyProfile/MyGroups.tsx"),
        route("/profile/notifications", "routes/MyProfile/MyNotifications.tsx"),
        route("/profile/payments", "routes/MyProfile/MyPayments.tsx"),
        route("/profile/edit", "routes/MyProfile/EditProfile.tsx")
    ]),
    layout("layouts/AdminLayout.tsx", [
        route("/admin/users", "routes/Admin/UserManagement.tsx"),
        route("/admin/poi", "routes/Admin/POIManagement.tsx"),
        route("/admin/billing", "routes/Admin/Billing.tsx"),
        route("/admin/profile", "routes/Admin/AdminProfile.tsx"),
        route("/admin/notifications", "routes/Admin/AdminNotifications.tsx"),
        route("/admin/create", "routes/Admin/CreateAdminAccount.tsx"),
        route("/admin/addpoi", "routes/Admin/CreatePOI.tsx"),
        route("/admin/tours", "routes/Admin/TourManagement.tsx")
    ]),
    route("/login", "routes/Login/Login.tsx")

] satisfies RouteConfig;