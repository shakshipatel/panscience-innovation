const PlaceholderComp = () => {
  return <div></div>;
};

const PUBLIC_ROUTES = [
  {
    path: "/",
    routes: [
      {
        path: "/landing",
        name: "landing",
        icon: null,
        component: PlaceholderComp,
        isSidebarMenu: false,
      },
      {
        path: "/privacy_policy",
        name: "privacy_policy",
        icon: null,
        component: PlaceholderComp,
        isSidebarMenu: false,
      },
      {
        path: "/tos",
        name: "tos",
        icon: null,
        component: PlaceholderComp,
        isSidebarMenu: false,
      },
      {
        path: "/feedback",
        name: "feedback",
        icon: null,
        component: PlaceholderComp,
        isSidebarMenu: false,
      },
      {
        path: "*",
        name: "not_found",
        icon: null,
        component: PlaceholderComp,
        isSidebarMenu: false,
      },
    ],
  },
];

export default PUBLIC_ROUTES;
