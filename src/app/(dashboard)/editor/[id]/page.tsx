export default async function EditorPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-900">Lesson Plan Editor</h1>
      <p className="mt-2 text-gray-600">
        Editor will be built in Phase 3
      </p>
      <p className="mt-4 text-sm text-gray-400">
        Lesson Plan ID: {id}
      </p>
    </div>
  );
}
