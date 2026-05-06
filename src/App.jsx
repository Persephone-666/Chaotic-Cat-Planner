import React, { useEffect, useState } from "react";

export default function App() {
  const days = ["Mon","Tue","Wed","Thu","Fri","Sat","Sun"];

  const defaultWeek = {
    personal: "",
    work: "",
    progress: "",
    notProgress: "",
    days: Object.fromEntries(days.map(d => [d, ""]))
  };

  const [tab, setTab] = useState("plan");
  const [dark, setDark] = useState(true);

  const [week, setWeek] = useState(defaultWeek);
  const [todos, setTodos] = useState({ work: [], personal: [] });
  const [todoInput, setTodoInput] = useState("");

  const [history, setHistory] = useState([]);
  const [selectedHistory, setSelectedHistory] = useState(null);

  const [collapsed, setCollapsed] = useState({});

  // 📝 NOTES (concessions system)
  const [noteTabs, setNoteTabs] = useState(["Main"]);
  const [activeNote, setActiveNote] = useState("Main");
  const [notes, setNotes] = useState({ Main: "" });
  const [newTab, setNewTab] = useState("");

  const [pawAnim, setPawAnim] = useState(false);

  // LOAD
  useEffect(() => {
    const w = localStorage.getItem("week");
    const t = localStorage.getItem("todos");
    const h = localStorage.getItem("history");
    const n = localStorage.getItem("notes");
    const nt = localStorage.getItem("noteTabs");

    if (w) setWeek(JSON.parse(w));
    if (t) setTodos(JSON.parse(t));
    if (h) setHistory(JSON.parse(h));
    if (n) setNotes(JSON.parse(n));
    if (nt) setNoteTabs(JSON.parse(nt));
  }, []);

  // SAVE
  useEffect(() => localStorage.setItem("week", JSON.stringify(week)), [week]);
  useEffect(() => localStorage.setItem("todos", JSON.stringify(todos)), [todos]);
  useEffect(() => localStorage.setItem("history", JSON.stringify(history)), [history]);
  useEffect(() => localStorage.setItem("notes", JSON.stringify(notes)), [notes]);
  useEffect(() => localStorage.setItem("noteTabs", JSON.stringify(noteTabs)), [noteTabs]);

  // WEEK ACTIONS
  const saveWeek = () => {
    setHistory([...history, { week, todos, date: new Date().toLocaleDateString() }]);
    setPawAnim(true);
    setTimeout(() => setPawAnim(false), 1200);
  };

  const endWeek = () => {
    setWeek(defaultWeek);
    setTodos({ work: [], personal: [] });
  };

  // TODOS
  const addTodo = (type) => {
    if (!todoInput) return;
    setTodos({
      ...todos,
      [type]: [...todos[type], { text: todoInput, done: false }]
    });
    setTodoInput("");
  };

  const toggleTodo = (type, i) => {
    const copy = [...todos[type]];
    copy[i].done = !copy[i].done;
    setTodos({ ...todos, [type]: copy });
  };

  const deleteTodo = (type, i) => {
    const copy = todos[type].filter((_, idx) => idx !== i);
    setTodos({ ...todos, [type]: copy });
  };

  // DAYS
  const updateDay = (d, val) => {
    setWeek({ ...week, days: { ...week.days, [d]: val } });
  };

  // NOTES
  const addNoteTab = () => {
    if (!newTab) return;
    setNoteTabs([...noteTabs, newTab]);
    setNotes({ ...notes, [newTab]: "" });
    setNewTab("");
  };

  // CAT SYSTEM
  const progress = week.progress.split("\n").filter(Boolean).length;
  const notProgress = week.notProgress.split("\n").filter(Boolean).length;
  const chaos = progress + notProgress;

  const cat =
    chaos === 0 ? "😴" :
    notProgress > progress ? "🐈‍⬛" :
    chaos > 10 ? "🔥🙀" :
    chaos > 5 ? "😼" : "😺";

  const theme = dark ? "bg-gray-900 text-white" : "bg-white text-black";

  return (
    <div className={`${theme} min-h-screen p-4 transition-all`}>

      {pawAnim && (
        <div className="fixed top-10 left-1/2 -translate-x-1/2 text-2xl">
          🐾🐾🐾
        </div>
      )}

      {/* HEADER */}
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-xl font-bold">🐱 Cat Chaos HQ {cat}</h1>
        <button onClick={() => setDark(!dark)} className="px-2 py-1 bg-purple-600 rounded">
          Theme
        </button>
      </div>

      {/* TABS */}
      <div className="flex gap-2 mb-4 flex-wrap">
        {["plan", "todos", "notes", "history"].map(t => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-2 py-1 rounded ${tab === t ? "bg-purple-600" : "bg-gray-700"}`}
          >
            {t}
          </button>
        ))}
      </div>

      {/* PLAN */}
      {tab === "plan" && (
        <div className="space-y-3">

          <textarea placeholder="🧍 Personal"
            className="w-full p-2 bg-gray-800 rounded"
            value={week.personal}
            onChange={(e)=>setWeek({...week, personal:e.target.value})}
          />

          <textarea placeholder="👔 Work"
            className="w-full p-2 bg-gray-800 rounded"
            value={week.work}
            onChange={(e)=>setWeek({...week, work:e.target.value})}
          />

          <textarea placeholder="📈 Progress"
            className="w-full p-2 bg-gray-800 rounded"
            value={week.progress}
            onChange={(e)=>setWeek({...week, progress:e.target.value})}
          />

          <textarea placeholder="📉 Not Progress"
            className="w-full p-2 bg-gray-800 rounded"
            value={week.notProgress}
            onChange={(e)=>setWeek({...week, notProgress:e.target.value})}
          />

          {/* DAYS */}
          {days.map(d => (
            <div key={d}>
              <button
                className="w-full text-left"
                onClick={() => setCollapsed({ ...collapsed, [d]: !collapsed[d] })}
              >
                {collapsed[d] ? "▶" : "▼"} {d}
              </button>

              {!collapsed[d] && (
                <input
                  className="w-full p-2 bg-gray-800 rounded"
                  value={week.days[d]}
                  onChange={(e)=>updateDay(d,e.target.value)}
                />
              )}
            </div>
          ))}

          <div className="flex gap-2">
            <button onClick={saveWeek} className="bg-green-600 px-3 py-2 rounded">
              Save
            </button>
            <button onClick={endWeek} className="bg-red-600 px-3 py-2 rounded">
              End Week
            </button>
          </div>
        </div>
      )}

      {/* TODOS */}
      {tab === "todos" && (
        <div>
          <input
            className="w-full p-2 bg-gray-800 rounded mb-2"
            value={todoInput}
            onChange={(e)=>setTodoInput(e.target.value)}
            placeholder="Add task"
          />

          <div className="flex gap-2 mb-3">
            <button onClick={()=>addTodo("work")} className="bg-purple-600 px-2 rounded">Work</button>
            <button onClick={()=>addTodo("personal")} className="bg-blue-600 px-2 rounded">Personal</button>
          </div>

          {["work","personal"].map(type => (
            <div key={type} className="mb-4">
              <h3 className="font-bold">{type}</h3>
              {todos[type].map((t,i)=>(
                <div key={i} className="flex justify-between">
                  <span onClick={()=>toggleTodo(type,i)}>
                    {t.done ? "✔" : "⬜"} {t.text}
                  </span>
                  <button onClick={()=>deleteTodo(type,i)}>🗑</button>
                </div>
              ))}
            </div>
          ))}
        </div>
      )}

      {/* NOTES */}
      {tab === "notes" && (
        <div>
          <div className="flex gap-2 flex-wrap mb-2">
            {noteTabs.map(n => (
              <button
                key={n}
                onClick={()=>setActiveNote(n)}
                className={`px-2 py-1 rounded ${activeNote===n?"bg-purple-600":"bg-gray-700"}`}
              >
                {n}
              </button>
            ))}
          </div>

          <div className="flex gap-2 mb-2">
            <input
              value={newTab}
              onChange={(e)=>setNewTab(e.target.value)}
              className="p-1 bg-gray-800 rounded"
              placeholder="new tab"
            />
            <button onClick={addNoteTab} className="bg-green-600 px-2 rounded">+</button>
          </div>

          <textarea
            className="w-full h-64 p-2 bg-gray-800 rounded"
            value={notes[activeNote] || ""}
            onChange={(e)=>setNotes({...notes, [activeNote]:e.target.value})}
          />
        </div>
      )}

      {/* HISTORY */}
      {tab === "history" && (
        <div>
          {!selectedHistory ? (
            history.map((h,i)=>(
              <div
                key={i}
                className="p-2 bg-gray-800 mb-2 rounded cursor-pointer"
                onClick={()=>setSelectedHistory(h)}
              >
                {h.date}
              </div>
            ))
          ) : (
            <div>
              <button onClick={()=>setSelectedHistory(null)}>Back</button>
              <pre className="text-xs">
                {JSON.stringify(selectedHistory, null, 2)}
              </pre>
            </div>
          )}
        </div>
      )}

    </div>
  );
}