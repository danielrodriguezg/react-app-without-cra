# Como crear una aplicacion React sin ningun bootstrapper (CRA o Vite)

## -crear package.json para instalar dependencias (npm init -y)
## -instalar babel (npm install --save-dev @babel/core babel-loader @babel/cli @babel/preset-env @babel/preset-react)
    -babel/core: libreria core para transpilar JSX a JS
    -babel-loader: permite enlazar babel con el bundler (en este caso Webpack)
    -babel-cli: es opcional. permite transpilar archivos mediante consola
    -babel/preset-env babel/preset-react: permiten convertir codigo ES6 en codigo javascript de versiones anteriores para compatibilidad con navegadores anteriores.

## -instalar webpack (npm install --save-dev webpack webpack-cli webpack-dev-server)
    -webpack: bundler. empaqueta los archivos de javascript en un solo archivo para que pueda ser procesable por el navegador.
    -webpack-cli: permite usar webpack en la linea de comandos.
    -webpack-dev-server: servidor de desarrollo para desplegar aplicacion. tambien permite usar hot reload como nodemon.
## -instalar html-webpack-plugin (npm install --save-dev html-webpack-plugin)
    -html-webpack-plugin hace lo mismo que la libreria de webpack pero para manejo de html.
## -instalar librerias de React (npm install react react-dom)
## -Configurar Babel. Se debe hacer un archivo .babelrc y en el agregar lo siguiente:
        
        {
            "presets": ["@babel/preset-env","@babel/preset-react"]
        }

## -Configurar webpack. Se debe crear un archivo webpack.config.js con lo siguiente:
        
        const HtmlWebpackPlugin = require('html-webpack-plugin');
        const path = require('path');

        module.exports = {
        entry: './index.js',
        mode: 'development',
        output: {
            path: path.resolve(__dirname, './dist'),
            filename: 'index_bundle.js',
        },
        target: 'web',
        devServer: {
            port: '5000',
            static: {
            directory: path.join(__dirname, 'public')
        },
            open: true,
            hot: true,
            liveReload: true,
        },
        resolve: {
            extensions: ['.js', '.jsx', '.json'],
        },
        module: {
            rules: [
            {
                test: /\.(js|jsx)$/, 
                exclude: /node_modules/, 
                use: 'babel-loader', 
            },
            ],
        },
        plugins: [
            new HtmlWebpackPlugin({
            template: path.join(__dirname, 'public', 'index.html')
            })
        ]
        };
        
## -Agregar scripts del package.json. Para agregar los scripts hay que abrir el archivo package.json y agregar los siguientes comandos en el objeto scripts:
    
        "scripts": {
            "start": "webpack-dev-server .",
            "build": "webpack ."
        }
        
## -para usar estilos, se debe instalar style-loader y css-loader (npm install --save-dev style-loader css-loader) y se debe configurar en webpack:

    module: {
        rules: [
            {
                test: /\.(js|jsx)$/,
                exclude: /node_modules/,
                use: 'babel-loader',
            },
            {
                test: /\.css$/i,
                use: [MiniCssExtractPlugin.loader, "css-loader"],
            },
        ],
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: path.join(__dirname, 'public', 'index.html')
        }),
        new MiniCssExtractPlugin(),
    ]
