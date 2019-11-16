import * as express from "express";
import * as mustacheExpress from "mustache-express";
import * as fileUpload from "express-fileupload";
import * as asyncHandler from "express-async-handler";
import * as convert from "./convert";

// change slides every SLIDE_INTERVAL seconds
const SLIDE_INTERVAL = 30
const SLIDES_DIR = __dirname + "/../data/slides";

const app = express();
const port = 3000;

app.engine("html", mustacheExpress());
app.use(fileUpload());

app.use(express.static(convert.SLIDES_DIR));
app.set("view engine", "html");
app.set("views", __dirname + "/../views");

app.get("/upload", (req, res) => {
    res.render("upload.html");
});

app.post(
    "/upload",
    asyncHandler(async (req, res) => {
        if (!req.files || Object.keys(req.files).length === 0) {
            res.status(400).send("No files were uploaded.");
            return;
        }

        let file = req.files.presentation;

        try {
            await convert.pdfToImages(file);

            res.send("Uploaded!");
        } catch (e) {
            console.error("Error processing upload: ", e);
            res.status(500).send("Error processing upload...");
        }
    })
);

app.get(
    "/",
    asyncHandler(async (req, res) => {
        const files = await convert.listFiles(convert.SLIDES_DIR);

        const presentationImages: string[] = [];

        for (const f of files) {
            if (f.endsWith(".jpg")) {
                presentationImages.push(f);
            }
        }

        res.render("presentation.html", {
            images: presentationImages,
            slideInterval: SLIDE_INTERVAL * 1000
        });
    })
);

app.listen(port, () => console.log(`Example app listening on port ${port}!`));
