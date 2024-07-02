let editor = CodeMirror.fromTextArea(document.getElementById('editor'), {
    mode: "text/x-c++src",
    theme: "dracula",
    lineNumbers: true,
    autoCloseBrackets: true
});
let width = window.innerWidth;
let height=window.innerHeight;
editor.setSize(0.7 * width,0.85*height);

let options=document.getElementById('autoSizingSelect');
let input=document.getElementById('input');
let output=document.getElementById('output');
let run=document.getElementById('run');


options.addEventListener('change',()=>{
    if(options.value === 'Java'){
        editor.setOption("mode","text/x-java");
    }
    else if(options.value === 'Python'){
        editor.setOption("mode","text/x-python");
    }
    else if(options.value === 'CPP'){
        editor.setOption("mode","text/x-c++src");
    }
})


run.addEventListener('click',async()=>{
    let code={
        code:editor.getValue(),
        lang:options.value,
        input:input.value
    }
    let odata=await fetch('http://localhost:8000/compile',{
        method:"POST",
        headers:{
            "Content-Type":"application/json"
        },
        body:JSON.stringify(code)
    })
    let d=await odata.json();
    output.value=d.output
})