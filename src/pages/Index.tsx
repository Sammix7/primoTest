const Index = () => {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-background via-background to-muted">
      <div className="w-full max-w-md px-6">
        <div className="flex flex-col items-center space-y-8">
          {/* Logo */}
          <div className="animate-in fade-in zoom-in duration-500">
            <img
              src="/trustable.png"
              alt="Trustable Logo"
              className="h-24 w-auto"
            />
          </div>

          {/* Welcome Card */}
          <div className="w-full animate-in fade-in slide-in-from-bottom-4 duration-700 delay-150">
            <div className="rounded-2xl border bg-card p-8 shadow-elegant">
              <h1 className="mb-2 text-2xl font-bold text-foreground">
                Welcome
              </h1>
              <p className="mb-6 text-muted-foreground">
                Try the following prompts to start
              </p>

              <ul className="space-y-3 text-base text-foreground">
                <li>✅ Change the home page in a Todo list</li>
                <li>📒 Change the home page in an Address book</li>
                <li>⏱️ Change the home page in a Pomodoro timer</li>
                <li>🧮 Change the home page in an Unit converter</li>
              </ul>
            </div>
          </div>

          {/* Info Text */}
          <p className="animate-in fade-in duration-1000 delay-300 text-center text-sm text-muted-foreground">
            Powered by Trustable
          </p>

          {/* Upcoming Features */}
          <p className="animate-in fade-in duration-1000 delay-500 text-center text-xs text-muted-foreground/70 max-w-sm">
            Upcoming in next releases: full support for AI, databases (SQL, NoSQL, vector), Redis and S3 with serverless backend
          </p>
        </div>
      </div>
    </div>
  );
};

export default Index;
