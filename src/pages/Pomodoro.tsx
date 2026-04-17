import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";

type Mode = "focus" | "shortBreak" | "longBreak";

const MODES: Record<Mode, { label: string; minutes: number; color: string }> = {
  focus: { label: "Focus", minutes: 25, color: "text-destructive" },
  shortBreak: { label: "Short Break", minutes: 5, color: "text-green-600" },
  longBreak: { label: "Long Break", minutes: 15, color: "text-blue-600" },
};

const Pomodoro = () => {
  const [mode, setMode] = useState<Mode>("focus");
  const [timeLeft, setTimeLeft] = useState(MODES.focus.minutes * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [sessions, setSessions] = useState(0);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (isRunning && timeLeft > 0) {
      intervalRef.current = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      handleComplete();
    }

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isRunning, timeLeft]);

  const handleComplete = () => {
    setIsRunning(false);
    if (mode === "focus") {
      const newSessions = sessions + 1;
      setSessions(newSessions);
      if (newSessions % 4 === 0) {
        setMode("longBreak");
        setTimeLeft(MODES.longBreak.minutes * 60);
      } else {
        setMode("shortBreak");
        setTimeLeft(MODES.shortBreak.minutes * 60);
      }
    } else {
      setMode("focus");
      setTimeLeft(MODES.focus.minutes * 60);
    }
  };

  const toggleTimer = () => {
    setIsRunning(!isRunning);
  };

  const resetTimer = () => {
    setIsRunning(false);
    setTimeLeft(MODES[mode].minutes * 60);
  };

  const changeMode = (newMode: Mode) => {
    setIsRunning(false);
    setMode(newMode);
    setTimeLeft(MODES[newMode].minutes * 60);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const progress = ((MODES[mode].minutes * 60 - timeLeft) / (MODES[mode].minutes * 60)) * 100;

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-background via-background to-muted">
      <div className="w-full max-w-md px-6">
        <div className="w-full animate-in fade-in slide-in-from-bottom-4 duration-700">
          <div className="rounded-2xl border bg-card p-8 shadow-elegant">
            <h1 className="mb-6 text-2xl font-bold text-foreground text-center">
              Pomodoro Timer
            </h1>

            <div className="mb-6 flex justify-center gap-2">
              {(Object.keys(MODES) as Mode[]).map((m) => (
                <Button
                  key={m}
                  variant={mode === m ? "default" : "outline"}
                  size="sm"
                  onClick={() => changeMode(m)}
                  className={mode === m ? "" : ""}
                >
                  {MODES[m].label}
                </Button>
              ))}
            </div>

            <div className="mb-8 flex flex-col items-center">
              <div className={`text-7xl font-bold mb-2 ${MODES[mode].color}`}>
                {formatTime(timeLeft)}
              </div>
              <div className="h-2 w-full rounded-full bg-muted mb-2">
                <div
                  className={`h-2 rounded-full transition-all ${mode === "focus" ? "bg-destructive" : mode === "shortBreak" ? "bg-green-600" : "bg-blue-600"}`}
                  style={{ width: `${progress}%` }}
                />
              </div>
              <p className="text-sm text-muted-foreground">
                {mode === "focus" ? "Time to focus!" : "Take a break"}
              </p>
            </div>

            <div className="flex justify-center gap-3">
              <Button
                onClick={toggleTimer}
                size="lg"
                className="w-32"
              >
                {isRunning ? "Pause" : "Start"}
              </Button>
              <Button
                onClick={resetTimer}
                variant="outline"
                size="lg"
                className="w-32"
              >
                Reset
              </Button>
            </div>

            <div className="mt-8 border-t pt-4">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Sessions completed</span>
                <span className="font-medium text-foreground">{sessions}</span>
              </div>
              <div className="mt-2 flex gap-1">
                {Array.from({ length: 4 }).map((_, i) => (
                  <div
                    key={i}
                    className={`h-3 w-3 rounded-full ${
                      i < sessions % 4 || (sessions > 0 && sessions % 4 === 0 && i === 3)
                        ? "bg-primary"
                        : "bg-muted"
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>

        <p className="mt-6 animate-in fade-in duration-1000 delay-300 text-center text-sm text-muted-foreground">
          Powered by Trustable
        </p>
      </div>
    </div>
  );
};

export default Pomodoro;
