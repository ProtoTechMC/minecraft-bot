exports.actionable =
  (start, end = () => null, mem = { interval: null }) =>
  (time) => {
    if (mem.interval) {
      clearInterval(mem.interval);
      mem.interval = false;
      end();
    }
    if (time == "stop") return end();
    start();

    if (time == "continues") return;

    const ms = time && Number(time);
    end();
    if (ms && !Number.isNaN(ms))
      mem.interval = setInterval(() => {
        start();
        end();
      }, ms);
  };
