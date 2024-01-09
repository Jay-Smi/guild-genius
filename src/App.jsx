import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { RosterBuilder } from "./pages/RosterBuilder";
import { characters, raids, groups, categories, lockout } from "./data/data";
import AppLayout from "./layouts/AppLayout/AppLayout";

export default function App() {
    const containers = [
        ...lockout,
        ...characters,
        ...raids,
        ...groups,
        ...categories,
    ];

    return (
        <BrowserRouter>
            <Routes>
                <Route element={<AppLayout />}>
                    <Route
                        index
                        element={<Navigate replace to="roster-builder" />}
                    />
                    <Route path="roster-builder" element={<RosterBuilder />} />
                </Route>

                {/* <Route path="login" element={<PageNotFound />} />
                    <Route path="*" element={<PageNotFound />} /> */}
            </Routes>
        </BrowserRouter>
    );
}
