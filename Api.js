let express = require("express");
let cors = require("cors");
let app = express();

app.use(cors());
let bodyP = require("body-parser");
let compiler = require("compilex");
let options = { stats: true };
compiler.init(options);

app.use(bodyP.json());
app.get("/", (req, res) => {
  compiler.flush(()=>{
    console.log("deleted");
  })
  res.sendFile(
    "C:/Users/Nithya/OneDrive/Documents/Desktop/compiler/index.html"
  );
});

app.post("/compile", (req, res) => {
  let code = req.body.code;
  let lang = req.body.lang;
  let input = req.body.input;

  console.log("Received request to compile:", { lang, code, input });

  if (lang === "Python") {
    var envData = {
      OS: "windows",
      cmd: "C:\\Users\\Nithya\\AppData\\Local\\Programs\\Python\\Python312\\python.exe",
    };
    if (!input) {
      compiler.compilePython(envData, code, function (data) {
        console.log("Python compile result:", data);
        if (data.output) {
          res.send(data);
        } else {
          res.send({ output: "error" });
        }
      });
    } else {
      compiler.compilePythonWithInput(envData, code, input, function (data) {
        console.log("Python compile with input result:", data);
        if (data.output) {
          res.send(data);
        } else {
          res.send({ output: "error" });
        }
      });
    }
  } else if (lang === "Java") {
    var envData = {
      OS: "windows",
      cmd: "C:\\Program Files\\Common Files\\Oracle\\Java\\javapath\\java.exe",
    };
    if (!input) {
      try {
        compiler.compileJava(envData, code, function (data) {
          console.log("Java compile result:", data);
          if (data.output) {
            res.send(data);
          } else {
            res.send({ output: "error" });
          }
        });
      } catch (e) {
        console.error("Error compiling Java code:", e);
        res.send({ output: "error", error: e });
      }
    } else {
      try {
        compiler.compileJavaWithInput(envData, code, input, function (data) {
          console.log("Java compile with input result:", data);
          if (data.output) {
            res.send(data);
          } else {
            res.send({ output: "error" });
          }
        });
      } catch (e) {
        console.error("Error compiling Java code with input:", e);
        res.send({ output: "error", error: e });
      }
    }
  } else if (lang === "CPP") {
    var envData = { OS: "windows", cmd: "g++", options: { timeout: 10000 } };
    if (!input) {
      compiler.compileCPP(envData, code, function (data) {
        console.log("CPP compile result:", data);
        if (data.output) {
          res.send(data);
        } else {
          res.send({ output: "error" });
        }
      });
    } else {
      compiler.compileCPPWithInput(envData, code, input, function (data) {
        console.log("CPP compile with input result:", data);
        if (data.output) {
          res.send(data);
        } else {
          res.send({ output: "error" });
        }
      });
    }
  } else {
    console.error("Unsupported language:", lang);
    res.status(400).json({ error: "Unsupported language" });
  }
});

app.listen(8000, () => {
  console.log("Server is running on port 8000");
});
