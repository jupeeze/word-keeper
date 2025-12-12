import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { SongListPage } from "@/pages/SongListPage";
import { LyricSyncPlayer } from "@/pages/LyricSyncPlayer";
import { LibraryPage } from "@/pages/LibraryPage";
import { LyricProgressPage } from "@/pages/LyricProgressPage";

export const router = createBrowserRouter(
  [
    {
      path: "/",
      element: <SongListPage />,
    },
    {
      path: "/player/:songId",
      element: <LyricSyncPlayer />,
    },
    {
      path: "/library",
      element: <LibraryPage />,
    },
    {
      path: "/progress/:songId",
      element: <LyricProgressPage />,
    },
  ],
  {
    basename: "/word-keeper",
  },
);

export function AppRoutes() {
  return <RouterProvider router={router} />;
}
