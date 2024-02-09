const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const pool = require("./DBConfig");
const app = express();

app.use(express.json());
dotenv.config();

const port = process.env.PORT || 5004;

app.use(cors());

/* app.get('/', async (req, res) => {
  try {
    const { data, error } = await supabase.from("allinone").select("*");

    if (error) {
      console.error('Supabase error:', error.message);
      throw error;
    }
    console.log(data)
    res.json(data);
  } catch (error) {
    console.error('Error fetching data:', error.message);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.get("/:id", async (req, res) => {
  const id = req.params.id;

  try {
    const { data: allData, error: allError } = await supabase
      .from("allinone")
      .select("*");

    if (allError) {
      console.error("Supabase error:", allError.message);
      res.status(500).json({ error: "Internal Server Error" });
      return;
    }

    const video = allData.find((record) => record.id == id);

    if (!video) {
      res.status(404).json(`There is no video with id ${id}`);
    } else {
      res.status(200).json(video);
    }
  } catch (error) {
    console.error("Error fetching video:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Delete video by ID
app.delete("/:id", async (req, res) => {
  const id = req.params.id;

  try {
    const { error } = await supabase.from("allinone").delete().eq("id", id);

    if (error) {
      console.error("Supabase error:", error.message);
      res.status(500).json({ error: "Internal Server Error" });
      return;
    }

    res.status(200).json({ message: `Video with id ${id} deleted successfully` });
  } catch (error) {
    console.error("Error deleting video:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Add new video
app.post("/", async (req, res) => {
  const { title, url, rating } = req.body;

  try {
    const { data, error } = await supabase
      .from("allinone")
      .insert([{ title, url, rating }]);

    if (error) {
      console.error("Supabase error:", error.message);
      res.status(500).json({ error: "Internal Server Error" });
      return;
    }

    res.status(201).json(data);
  } catch (error) {
    console.error("Error adding video:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}); */

//const pool = require("./db");

// Get all videos
app.get('/', async (req, res) => {
  try {
    const client = await pool.connect();
    try {
      const result = await client.query('SELECT * FROM allinone');
      res.json(result.rows);
    } finally {
      client.release();
    }
  } catch (error) {
    console.error('Error fetching data:', error.message);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Get video by ID
app.get("/:id", async (req, res) => {
  const id = req.params.id;

  try {
    const client = await pool.connect();
    try {
      const result = await client.query('SELECT * FROM allinone WHERE id = $1', [id]);
      if (result.rows.length === 0) {
        res.status(404).json(`There is no video with id ${id}`);
      } else {
        res.status(200).json(result.rows[0]);
      }
    } finally {
      client.release();
    }
  } catch (error) {
    console.error("Error fetching video:", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Delete video by ID
app.delete("/:id", async (req, res) => {
  const id = req.params.id;

  try {
    const client = await pool.connect();
    try {
      const result = await client.query('DELETE FROM allinone WHERE id = $1', [id]);
      res.status(200).json({ message: `Video with id ${id} deleted successfully` });
    } finally {
      client.release();
    }
  } catch (error) {
    console.error("Error deleting video:", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Add new video
app.post("/", async (req, res) => {
  const { title, url, rating } = req.body;

  try {
    const client = await pool.connect();
    try {
      const result = await client.query('INSERT INTO allinone (title, url, rating) VALUES ($1, $2, $3) RETURNING *', [title, url, rating]);
      res.status(201).json(result.rows[0]);
    } finally {
      client.release();
    }
  } catch (error) {
    console.error("Error adding video:", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
});


app.listen(port, () => console.log(`Listening on port ${port}`));

//module.exports = app;