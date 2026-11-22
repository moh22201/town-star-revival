import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "قريتي — لعبة بناء وإنتاج" },
      { name: "description", content: "ابنِ قريتك، ازرع الحقول، شغّل المصانع وبِع منتجاتك في لعبة بناء واقتصاد مستوحاة من Town Star." },
      { property: "og:title", content: "قريتي — لعبة بناء وإنتاج" },
      { property: "og:description", content: "ازرع، اصنع، وبِع: سلسلة إنتاج كاملة في قرية متحركة." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

function Index() {
  return (
    <main className="fixed inset-0 bg-background">
      <h1 className="sr-only">قريتي</h1>
      <iframe src="/game/index.html" title="قريتي" className="h-full w-full border-0" />
    </main>
  );
}
