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
        route("/profile/friends", "routes/MyFriends/MyFriends.tsx"),
        route("/profile/tours", "routes/MyTours/MyTours.tsx"),
        route("/profile/groups", "routes/MyGroups/MyGroups.tsx"),
        route("/profile/notifications", "routes/MyNotifications/MyNotifications.tsx")
    ]),
    route("/login", "routes/Login/Login.tsx")

] satisfies RouteConfig;