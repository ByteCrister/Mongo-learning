const express = require('express');
const mongoose = require('mongoose');

const app = express();
const PORT = 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const connectDB = async () => {
    try {
        await mongoose.connect("mongodb://localhost:27017/ProductDB");
        console.log('Database is connected.');

    } catch (error) {
        console.log('Database error: ' + error);
        process.exit(1);
    }
};


// *creating schema of product
const productSchema = new mongoose.Schema({
    title: {
        type: String,
        trim: true,
        require: [true, "Product title is required."],
        minlength: [3, "Product title length must be at least 3."],
        maxlength: [100, "Product title length must be under 100 ."],
        lowercase: true,
        uppercase: false,
        enum: {
            values: ["Samsung", "Apple"],
            message: "{VALUE} not supports."
        }
    },
    price: {
        type: Number,
        require: true,
        min: [100, "Price must be at least 100."],
        max: [2000, "Price must be under 2000."]
    },
    email: {
        type: String,
        unique: [true, "Email already exist!"]
    },
    description: {
        type: String,
        require: true
    },
    createdAt: {
        type: Date,
        default: Date.now()
    }
});

// *creating model of the schema
const ProductModel = mongoose.model("Products", productSchema);

app.get("/", (req, res) => {
    res.send("<h1>Welcome to Home page.</h1>")
});

app.get('/products', async (req, res) => {
    try {
        const query = {};
        if (req.query.gt) {
            query.price = { ...query.price, $gt: parseInt(req.query.gt) };
        }
        if (req.query.lt) {
            query.price = { ...query.price, $lt: parseInt(req.query.lt) };
        }

        //    query = {
        //         price: { condition1, condition2}
        //     }
        const count = await ProductModel.find(query).countDocuments();
        res.status(200).send(
            // await ProductModel.find().limit(2)
            //await ProductModel.find({ price: { $gte: 100 } })
            //await ProductModel.find({ price: { $in: [100, 200, 300] } })
            // await ProductModel.find({ $and: [{ price: { $gt: req.query.gt } || {$exists: true} }, { price: { $lt: req.query.lt } || {$exists: true} }] })
            { ...await ProductModel.find(query).sort({ price: -1 }).select({ _id: 0, title: 1, price: 1, description: 1 }), count: count }
            || { message: "Products not found!" });
    } catch (error) {
        res.status(500).send({ message: error.message });
    }
});

app.get('/products/:id', async (req, res) => {
    try {
        // res.status(200).send(await ProductModel.findOne({ _id: req.params.id }).select({ title: 1, price: 1, description: 1, _id: 0 }) || { message: "Product not found!" });
        res.status(200).send(await ProductModel.findOne({ _id: req.params.id }, { title: 1, price: 1, description: 1, _id: 0 }) || { message: "Product not found!" });
    } catch (error) {
        res.status(500).send({ message: error.message });
    }
});

app.post('/products', async (req, res) => {
    try {
        // *For insert single document
        const resNewProduct = await new ProductModel({ title: req.body.title, price: req.body.price, description: req.body.description }).save();

        // *For insert multiple document 
        // const resNewProduct = await ProductModel.insertMany([
        //     {
        //         "title": "Test Product - 5",
        //         "price": 200,
        //         "description": "A product description  - 5"
        //     },
        //     {
        //         "title": "Test Product - 6",
        //         "price": 300,
        //         "description": "A product description  - 6"
        //     }
        // ]);

        res.status(201).send(resNewProduct);

    } catch (error) {
        res.status(500).send({ message: error.message });
    }
});


app.put('/products', async (req, res) => {
    try {
        // const resOfUpdatedProduct = await ProductModel.updateOne({ _id: req.body._id }, { $set: { price: req.body.price } });
        const resOfUpdatedProduct = await ProductModel.findByIdAndUpdate(
            req.body._id, // First argument: _id directly (not an object)
            { $set: { price: req.body.price } }, // Second argument: update object
            { new: true } // Third argument: options object (e.g., to return the new document)
        );

        res.status(201).send(resOfUpdatedProduct || { message: "Product not found!" });

    } catch (error) {
        res.status(500).send({ message: error.message });
    }
});

app.delete('/products/:id', async (req, res) => {
    try {
        // res.status(200).send(await ProductModel.deleteOne({ _id: req.params.id }) || { message: "Product is not found with this id!!" });

        // *To see additional information use -> findByIdAndDelete()
        res.status(200).send(await ProductModel.findByIdAndDelete({ _id: req.params.id }) || { message: "Product is not found with this id!!" });

    } catch (error) {
        res.status(500).send({ message: error.message });
    }
});



app.listen(PORT, async () => {
    console.log(`server is running on: http://localhost:${PORT}`);
    await connectDB();
});