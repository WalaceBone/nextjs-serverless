
import { useState } from "react";
import bcrypt from "bcryptjs";

const Send = () => {
  const [showPopup, setShowPopup] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e: { preventDefault: () => void; }) => {
    e.preventDefault();

    const now = new Date();
    const timestamp = now.toISOString().replace(/:/g, '-').replace(/\..+/, '').split('T')[0];

    const hashedPassword = await bcrypt.hash(password, "$2a$10$ZcOtZR.JnHAZiMl5eFpCF.");
    const res = await fetch("/api/send", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username, password: hashedPassword, filename: `data-${timestamp}.csv` }),
    });
    const data = await res.json();
    console.log(data);
    bcrypt.genSalt(10, function (err, salt) {
      if (err) {
        // handle error
        console.error(err);
        return;
      }

      console.log(salt); // This will log the generated salt
    });
  };

  return (
    <div className="container">
      <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded" onClick={() => setShowPopup(true)}>Send</button>
      {showPopup && (
        <div>
          <form onSubmit={handleSubmit}>
            <label>
              Username:
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </label>
            <label>
              Password:
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </label>
            <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded" type="submit">Submit</button>
          </form>
        </div>
      )}
    </div>
  );
};

export default Send;
