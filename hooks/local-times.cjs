// Converts the UTC times in an Earthquake Watch result to this computer's time
// zone and says how long ago each one was, so the answer does not rest on time
// arithmetic done in prose.
// Reads the hook event on stdin and writes context to stdout. No files, no network.
const fs = require('node:fs');

function textOf(response) {
  const raw = typeof response === 'string' ? response : JSON.stringify(response ?? '');
  return raw.replace(/\\n/g, '\n');
}

function utcTimes(text) {
  const seen = new Map();
  const patterns = [
    /(\d{4}-\d{2}-\d{2}) (\d{2}:\d{2})(?::\d{2})? UTC/g,
    /Time \(UTC\):\s*(\d{4}-\d{2}-\d{2}) (\d{2}:\d{2})(?::\d{2})?/g
  ];
  for (const pattern of patterns) {
    for (const match of text.matchAll(pattern)) {
      const label = `${match[1]} ${match[2]} UTC`;
      const instant = Date.parse(`${match[1]}T${match[2]}:00Z`);
      if (Number.isFinite(instant) && !seen.has(label)) seen.set(label, instant);
    }
  }
  return [...seen].slice(0, 15);
}

function ago(instant, now) {
  const minutes = Math.round((now - instant) / 60000);
  if (minutes < 0) return 'in the future by this clock';
  if (minutes < 1) return 'less than a minute ago';
  if (minutes < 90) return `${minutes} minute${minutes === 1 ? '' : 's'} ago`;
  const hours = Math.round(minutes / 60);
  if (hours < 48) return `${hours} hours ago`;
  return `${Math.round(hours / 24)} days ago`;
}

function emit(event, now) {
  const times = utcTimes(textOf(event.tool_response));
  if (times.length === 0) return;
  const zone = Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC';
  const local = new Intl.DateTimeFormat('en-US', {
    timeZone: zone, weekday: 'short', month: 'short', day: 'numeric',
    hour: 'numeric', minute: '2-digit', timeZoneName: 'short'
  });
  const sameAsUtc = zone === 'UTC' || zone === 'Etc/UTC';
  const lines = times.map(([label, instant]) =>
    sameAsUtc ? `${label} was ${ago(instant, now)}.` : `${label} is ${local.format(instant)}, ${ago(instant, now)}.`);
  const lead = sameAsUtc
    ? 'This computer keeps UTC, so no local conversion is given.'
    : `This computer's time zone is ${zone}. That is the reader's zone, which may differ from local time at the epicenter.`;
  const additionalContext = `${lead} ${lines.join(' ')} Use these figures when giving a local time or saying how recent an event was, and keep the UTC time beside them.`;
  process.stdout.write(JSON.stringify({ hookSpecificOutput: { hookEventName: 'PostToolUse', additionalContext } }));
}

try {
  emit(JSON.parse(fs.readFileSync(0, 'utf8')), Date.now());
} catch {
  // An unexpected payload never interrupts the tool or changes its result.
}
