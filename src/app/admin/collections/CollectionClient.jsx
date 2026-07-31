"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

import Header from "./components/Header";
import StatsCards from "./components/StatsCards";
import ToolBar from "./components/ToolBar";
import PotentialPages from "./components/PotentialPages";
import LandingPagesTable from "./components/LandingPagesTable";
import DetailsDrawer from "./components/DetailsDrawer";

export default function CollectionClient({
  editId,
}) {
  const API = "/api";
const router = useRouter();

  // =====================================================
  // STATES
  // =====================================================

  const [loading, setLoading] = useState(true);

  const [generating, setGenerating] =
    useState(false);

    const [publishing, setPublishing] = useState(false);

    const [deleting, setDeleting] = useState(false);

  const [stats, setStats] = useState({
  total: 0,
  draft: 0,
  published: 0,
  averageScore: 0,
});

  const [potentialPages, setPotentialPages] =
    useState([]);

  const [landingPages, setLandingPages] =
    useState([]);

    const [search, setSearch] = useState("");
const [tab, setTab] = useState("all");

  const [selectedPages, setSelectedPages] =
    useState([]);

  const [selectedPage, setSelectedPage] =
    useState(null);

  const [drawerOpen, setDrawerOpen] =
    useState(false);

  // =====================================================
  // FETCH LANDING PAGES
  // =====================================================

  const fetchLandingPages = async () => {
    try {
      setLoading(true);

      const res = await fetch(
        `${API}/landing-pages`,
        {
          credentials: "include",
        }
      );

      const data = await res.json();

      if (!res.ok) {
        console.error(data.message);
        return;
      }

      const pages = data.data || [];

      setLandingPages(pages);

      setStats({
  total: pages.length,

  draft: pages.filter(
    (page) => page.status === "draft"
  ).length,

  published: pages.filter(
    (page) => page.status === "published"
  ).length,

  averageScore: pages.length
    ? Math.round(
        pages.reduce(
          (sum, page) =>
            sum + (page.seoScore || 0),
          0
        ) / pages.length
      )
    : 0,
});
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  // =====================================================
  // GENERATE COLLECTIONS
  // =====================================================

  const generateCollections = async () => {
    if (
  !window.confirm(
    "Generate landing pages now?"
  )
) {
  return;
}
    try {
      setGenerating(true);

      const res = await fetch(
        `${API}/landing-pages/generate`,
        {
          method: "POST",
          credentials: "include",
        }
      );

      const data = await res.json();

      if (!res.ok) {
        toast.error("Unable to generate landing pages.");
        return;
      }

      await fetchLandingPages();

      toast.success("Landing pages generated successfully.");

    } catch (error) {
      console.error(error);

      toast.error("Unable to generate landing pages.");
    } finally {
      setGenerating(false);
    }
  };

  // =====================================================
// PUBLISH
// =====================================================

const publishLandingPage = async (id) => {
  try {
    const res = await fetch(
      `${API}/landing-pages/${id}/publish`,
      {
        method: "PATCH",
        credentials: "include",
      }
    );

    const data = await res.json();

    if (!res.ok) {
      toast.error(
        data.message || "Unable to publish."
      );
      return;
    }

    toast.success("Landing page published.");

    await fetchLandingPages();

if (selectedPage?._id === id) {
  const updated = await fetch(
    `${API}/landing-pages/${id}`,
    {
      credentials: "include",
    }
  );

  if (updated.ok) {
    const json = await updated.json();
    setSelectedPage(json.data);
  }
}
  } catch (error) {
    console.error(error);
    toast.error("Unable to publish.");
  }
};

// =====================================================
// UNPUBLISH
// =====================================================

const unpublishLandingPage = async (id) => {
  try {
    const res = await fetch(
      `${API}/landing-pages/${id}/unpublish`,
      {
        method: "PATCH",
        credentials: "include",
      }
    );

    const data = await res.json();

    if (!res.ok) {
      toast.error(
        data.message || "Unable to unpublish."
      );
      return;
    }

    toast.success("Moved back to Draft.");

    await fetchLandingPages();

if (selectedPage?._id === id) {
  const updated = await fetch(
    `${API}/landing-pages/${id}`,
    {
      credentials: "include",
    }
  );

  if (updated.ok) {
    const json = await updated.json();
    setSelectedPage(json.data);
  }
}
  } catch (error) {
    console.error(error);
    toast.error("Unable to unpublish.");
  }
};

// =====================================================
// DELETE LANDING PAGE
// =====================================================

const deleteLandingPage = async (id) => {

  try {

    const res = await fetch(
      `${API}/landing-pages/${id}`,
      {
        method: "DELETE",
        credentials: "include",
      }
    );


    const data = await res.json();


    if (!res.ok) {

      toast.error(
        data.message || "Unable to delete."
      );

      return;

    }


    toast.success(
  "Landing page permanently deleted."
);


    setLandingPages((prev)=>
      prev.filter(
        (page)=>page._id !== id
      )
    );


    setSelectedPages((prev)=>
      prev.filter(
        (pageId)=>pageId !== id
      )
    );


    closeDrawer();


    await fetchLandingPages();


  } catch(error){

    console.error(error);

    toast.error(
      "Unable to delete landing page."
    );

  }

};

// =====================================================
// EDIT LANDING PAGE
// =====================================================

const updateLandingPage = (page) => {
  window.location.href = `/admin/seo-engine/edit/${page._id}`;
};


// =====================================================
// BULK PUBLISH
// =====================================================

const publishPages = async () => {
  if (!selectedPages.length) return;

  if (
    !window.confirm(
      `Publish ${selectedPages.length} landing page(s)?`
    )
  ) {
    return;
  }

  try {
    setPublishing(true);

    const responses = await Promise.all(
  selectedPages.map((id) =>
    fetch(`${API}/landing-pages/${id}/publish`, {
      method: "PATCH",
      credentials: "include",
    })
  )
);

const failed = responses.filter((r) => !r.ok);

if (failed.length) {
  toast.error(
    `${failed.length} page(s) failed to publish.`
  );
} else {
  toast.success(
    `${selectedPages.length} landing page(s) published.`
  );
}

    setSelectedPages([]);

    await fetchLandingPages();
  } catch (error) {
    console.error(error);
    toast.error("Unable to publish pages.");
  } finally {
    setPublishing(false);
  }
};


const publishAllPages = async () => {
  if (!landingPages.length) return;

  if (
    !window.confirm(
      `Publish ALL ${landingPages.length} landing pages?`
    )
  ) {
    return;
  }

  try {
    setPublishing(true);

    await Promise.all(
      landingPages.map((page) =>
        fetch(
          `${API}/landing-pages/${page._id}/publish`,
          {
            method: "PATCH",
            credentials: "include",
          }
        )
      )
    );

    toast.success("All landing pages published.");

    await fetchLandingPages();
    setSelectedPages([]);
  } catch {
    toast.error("Unable to publish all pages.");
  } finally {
    setPublishing(false);
  }
};

const deleteAllPages = async () => {
  if (!landingPages.length) return;

  if (
    !window.confirm(
      `Delete ALL ${landingPages.length} landing pages?\n\nThis cannot be undone.`
    )
  ) {
    return;
  }

  try {
    setDeleting(true);

    await Promise.all(
      landingPages.map((page) =>
        fetch(
          `${API}/landing-pages/${page._id}`,
          {
            method: "DELETE",
            credentials: "include",
          }
        )
      )
    );

    toast.success("All landing pages deleted.");

    await fetchLandingPages();
    setSelectedPages([]);
  } catch {
    toast.error("Unable to delete all pages.");
  } finally {
    setDeleting(false);
  }
};
// =====================================================
// BULK DELETE
// =====================================================

const deletePages = async () => {

  if(!selectedPages.length) return;


  if(
    !window.confirm(
      `Delete ${selectedPages.length} landing page(s)?`
    )
  ){
    return;
  }


  try{

    setDeleting(true);


    const responses = await Promise.all(
  selectedPages.map((id) =>
    fetch(
      `${API}/landing-pages/${id}`,
      {
        method: "DELETE",
        credentials: "include",
      }
    )
  )
);

const failed = responses.filter((r) => !r.ok);

if (failed.length) {
  toast.error(
    `${failed.length} page(s) failed to delete.`
  );
} else {
  toast.success(
    `${selectedPages.length} landing page(s) permanently deleted.`
  );
}


    setSelectedPages([]);


    await fetchLandingPages();


  }catch(error){

    console.error(error);

    toast.error(
      "Unable to delete pages."
    );


  }finally{

    setDeleting(false);

  }

};

  // =====================================================
  // INITIAL LOAD
  // =====================================================

  useEffect(() => {
    fetchLandingPages();
  }, []);

  useEffect(() => {
  if (!editId || landingPages.length === 0) return;

  const page = landingPages.find(
    (item) => item._id === editId
  );

  if (page) {
    setSelectedPage(page);
    setDrawerOpen(true);

    window.history.replaceState(
      {},
      "",
      "/admin/seo-engine"
    );
  }
}, [editId, landingPages]);

  // =====================================================
  // DRAWER
  // =====================================================

  const openDrawer = (page) => {
    setSelectedPage(page);
    setDrawerOpen(true);
  };

  const closeDrawer = () => {
    setDrawerOpen(false);
    setSelectedPage(null);
  };

  // =====================================================
// FILTERED PAGES
// =====================================================

const filteredPages = landingPages.filter((page) => {
  // Search
  const matchesSearch =
    page.title
      ?.toLowerCase()
      .includes(search.toLowerCase()) ||
    page.slug
      ?.toLowerCase()
      .includes(search.toLowerCase());

  if (!matchesSearch) return false;

  switch (tab) {
    case "draft":
      return page.status === "draft";

    case "published":
      return page.status === "published";

    case "ignored":
      return page.ignoreGeneration === true;

    default:
      return true;
  }
});
  // =====================================================
  // LOADING
  // =====================================================

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[70vh]">
        <div className="text-lg font-semibold">
          Loading Collection Engine...
        </div>
      </div>
    );
  }

  // =====================================================
  // UI
  // =====================================================

  return (
    <div className="space-y-6">
      <Header />

      <StatsCards stats={stats} />

      <ToolBar
  search={search}
  setSearch={setSearch}
  tab={tab}
  setTab={setTab}
  selectedPages={selectedPages}
  totalPages={landingPages.length}
  generateCollections={generateCollections}
  generating={generating}
  refreshCollections={fetchLandingPages}
  publishPages={publishPages}
  publishAllPages={publishAllPages}
  publishing={publishing}
  deletePages={deletePages}
  deleteAllPages={deleteAllPages}
  deleting={deleting}
/>

      <LandingPagesTable
  pages={filteredPages}
  selectedPages={selectedPages}
  setSelectedPages={setSelectedPages}
  openDrawer={openDrawer}
  publishLandingPage={publishLandingPage}
  unpublishLandingPage={unpublishLandingPage}
/>

      <DetailsDrawer
  open={drawerOpen}
  page={selectedPage}
  onClose={closeDrawer}
  publishLandingPage={publishLandingPage}
  unpublishLandingPage={unpublishLandingPage}
  updateLandingPage={updateLandingPage}
  deleteLandingPage={deleteLandingPage}
/>

    </div>
  );
}