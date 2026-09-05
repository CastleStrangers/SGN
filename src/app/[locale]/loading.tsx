export default function RootLocaleLoading() {
  return (
    <div className="min-h-screen bg-background animate-pulse">
      {/* Skeleton Top bar placeholder */}
      <div className="h-10 bg-muted/40 border-b border-border/40 hidden md:block" />

      {/* Skeleton Navigation Header */}
      <div className="h-16 lg:h-20 bg-card border-b border-border/50">
        <div className="max-w-7xl mx-auto px-4 h-full flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-muted" />
            <div className="h-6 w-36 rounded-md bg-muted hidden sm:block" />
          </div>
          <div className="hidden lg:flex items-center gap-6">
            <div className="h-4 w-16 rounded bg-muted" />
            <div className="h-4 w-20 rounded bg-muted" />
            <div className="h-4 w-16 rounded bg-muted" />
            <div className="h-4 w-20 rounded bg-muted" />
          </div>
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-muted" />
            <div className="w-9 h-9 rounded-xl bg-muted" />
          </div>
        </div>
      </div>

      {/* Main Content Skeleton */}
      <main className="max-w-7xl mx-auto px-4 py-8 space-y-8">
        {/* Hero banner skeleton */}
        <div className="w-full h-48 md:h-72 rounded-3xl bg-muted/70 flex flex-col justify-end p-6 md:p-10 space-y-3">
          <div className="h-8 md:h-10 w-3/4 max-w-xl rounded-xl bg-muted-foreground/10" />
          <div className="h-4 w-1/2 max-w-sm rounded-lg bg-muted-foreground/10" />
        </div>

        {/* Content grid skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pt-4">
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className="bg-card rounded-2xl border border-border/50 p-5 space-y-4 shadow-sm"
            >
              <div className="w-full h-44 rounded-xl bg-muted" />
              <div className="space-y-2">
                <div className="h-5 w-4/5 rounded-lg bg-muted" />
                <div className="h-4 w-full rounded-lg bg-muted/60" />
                <div className="h-4 w-2/3 rounded-lg bg-muted/60" />
              </div>
              <div className="pt-2 flex items-center justify-between">
                <div className="h-4 w-20 rounded bg-muted" />
                <div className="h-4 w-12 rounded bg-muted" />
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
