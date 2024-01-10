import {
    Outlet,
    RouterProvider,
    lazyRouteComponent,
    Link,
    useNavigate,
    useSearch,
    Router,
    Route,
    redirect,
    ErrorComponent,
    rootRouteWithContext,
    useRouter,
    MatchRoute,
    useRouterState,
} from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/router-devtools";
import {
    QueryClient,
    QueryClientProvider,
    queryOptions,
    useMutation,
    useSuspenseQuery,
} from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { RosterBuilder } from "./pages/RosterBuilder";

import AppLayout from "./layouts/AppLayout/AppLayout";
import GlobalStyles from "./styles/GlobalStyles";

const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            refetchOnWindowFocus: false,
            staleTime: Infinity,
        },
    },
});

const rootRoute = rootRouteWithContext()({ component: AppLayout });

const indexRoute = new Route({
    getParentRoute: () => rootRoute,
    path: "/",
    component: RosterBuilder,
});

const routeTree = rootRoute.addChildren([indexRoute]);
const router = new Router({
    routeTree,
    context: {
        queryClient,
    },
    defaultPreload: "intent",
    defaultPreloadStaleTime: 0,
});

export default function App() {
    return (
        <QueryClientProvider client={queryClient}>
            <GlobalStyles />

            <RouterProvider router={router} />
            {/* <BrowserRouter>
                <Routes>
                    <Route element={<AppLayout />}>
                        <Route
                            index
                            element={<Navigate replace to="roster-builder" />}
                        />
                        <Route
                            path="roster-builder"
                            element={<RosterBuilder />}
                        />
                    </Route>

                   
                </Routes>
            </BrowserRouter> */}
        </QueryClientProvider>
    );
}
