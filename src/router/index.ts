import { createRouter, createWebHistory, RouteRecordRaw } from "vue-router";
import Home from "../views/Home.vue";
const routes: Array<RouteRecordRaw> = [
  {
    path: "/",
    name: "Home",
    component: Home,
  },
  {
    path: "/newuser",
    name: "NewUser",
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () =>
      import(/* webpackChunkName: "newuser" */ "../views/NewUser.vue"),
  },
  {
    path: "/users",
    name: "Users",
    // route level code-splitting
    // this generates a separate chunk (users.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () =>
      import(/* webpackChunkName: "users" */ "../views/Users.vue"),
  },
  {
    path: "/users/user/:id",
    name: "User",
    props: true,
    // route level code-splitting
    // this generates a separate chunk (user.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "user" */ "../views/User.vue"),
    children: [
      {
        path: "/users/user/:id/records",
        name: "Records",
        props: true,
        // route level code-splitting
        // this generates a separate chunk (user.[hash].js) for this route
        // which is lazy-loaded when the route is visited.
        component: () =>
          import(/* webpackChunkName: "records" */ "../views/Records.vue"),
      },
      {
        path: "/users/user/:id/updateuser",
        name: "UpdateUser",
        props: true,
        // route level code-splitting
        // this generates a separate chunk (user.[hash].js) for this route
        // which is lazy-loaded when the route is visited.
        component: () =>
          import(
            /* webpackChunkName: "updateuser" */ "../views/UpdateUser.vue"
          ),
      },
      {
        path: "/users/user/:id/manuel",
        name: "Manuel",
        props: true,
        // route level code-splitting
        // this generates a separate chunk (user.[hash].js) for this route
        // which is lazy-loaded when the route is visited.
        component: () =>
          import(/* webpackChunkName: "Manuel" */ "../views/Manuel.vue"),
      },
      {
        path: "/users/user/:id/medicalhistory",
        name: "MedicalHistory",
        props: true,
        // route level code-splitting
        // this generates a separate chunk (user.[hash].js) for this route
        // which is lazy-loaded when the route is visited.
        component: () =>
          import(
            /* webpackChunkName: " *MedicalHistory" */ "../views/MedicalHistory.vue"
          ),
      },
      {
        path: "/users/user/:id/treatment",
        name: "Treatment",
        props: true,
        // route level code-splitting
        // this generates a separate chunk (user.[hash].js) for this route
        // which is lazy-loaded when the route is visited.
        component: () =>
          import(
            /* webpackChunkName: " *Treatment" */ "../views/Treatment.vue"
          ),
      },
    ],
  },
  {
    path: "/archives",
    name: "Archives",
    props: true,
    // route level code-splitting
    // this generates a separate chunk (user.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () =>
      import(/* webpackChunkName: " *Archives" */ "../views/Archives.vue"),
  },
  {
    path: "/staff",
    name: "Staff",
    props: true,
    // route level code-splitting
    // this generates a separate chunk (user.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () =>
      import(/* webpackChunkName: " *Staff" */ "../views/Staff.vue"),
  },
  {
    path: "/signup",
    name: "SignUp",
    props: true,
    // route level code-splitting
    // this generates a separate chunk (user.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () =>
      import(/* webpackChunkName: " *SignUp" */ "../views/SignUp.vue"),
  },
  {
    path: "/staffdaywork",
    name: "StaffDayWork",
    props: true,
    // route level code-splitting
    // this generates a separate chunk (user.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () =>
      import(
        /* webpackChunkName: " *StaffDayWork" */ "../views/StaffDayWork.vue"
      ),
    children: [
      {
        path: "/staffdaywork/:id/staffpage",
        name: "StaffPage",
        props: true,
        // route level code-splitting
        // this generates a separate chunk (user.[hash].js) for this route
        // which is lazy-loaded when the route is visited.
        component: () =>
          import(
            /* webpackChunkName: " *StaffPage" */ "../views/StaffPage.vue"
          ),
      },
      {
        path: "/staffdaywork/works",
        name: "Works",
        props: true,
        // route level code-splitting
        // this generates a separate chunk (user.[hash].js) for this route
        // which is lazy-loaded when the route is visited.
        component: () =>
          import(/* webpackChunkName: " *Works" */ "../views/Works.vue"),
      },
    ],
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

export default router;
