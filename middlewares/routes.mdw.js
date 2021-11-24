
import {dirname} from "path";
import {fileURLToPath} from "url";
const __dirname=dirname(fileURLToPath(import.meta.url))

//routes
export default function(app) {
    app.get('/', (req, res) => {
        res.render('home')
    })
}