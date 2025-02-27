import ReactDOM from "react-dom/client";
import {useEffect, useRef, useState} from "react";
import * as esbuild from 'esbuild-wasm'
import {unpkgPathPlugin} from "./plugins/unpkg-path-plugin";

const App = () => {
    const [input, setInput] = useState("");
    const [code, setCode] = useState("");
    const ref = useRef<any>(null)

    const startService = async () => {
            ref.current = await esbuild.startService({
                worker: true,
                wasmURL: '/esbuild.wasm'
            })
    }

    useEffect(() => {
        startService()
    }, [])

    const onClick = async () => {
        if(!ref.current) {
            return
        }

        const result = await ref.current.build({
            entryPoints: ['index.js'],
            bundle: true,
            write: false,
            plugins: [unpkgPathPlugin()]
        })

        // console.log(result)

        setCode(result.outputFiles[0].text)
    }

    return <div>
        <textarea value={input} onChange={e=> setInput(e.target.value)}>

        </textarea>
        <div>
            <button onClick={onClick}>Отправить</button>
        </div>
        <pre>{code}</pre>
    </div>
}

const root = ReactDOM.createRoot(document.getElementById('root')!);
root.render(<App />);