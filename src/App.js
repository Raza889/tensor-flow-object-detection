import {useRef, useState} from 'react';
import * as cocoSsd from '@tensorflow-models/coco-ssd';
import './App.css';
require('@tensorflow/tfjs-backend-cpu');
require('@tensorflow/tfjs-backend-webgl');

function App() {
    const img = useRef();
    const [imgsrc, setImgSrc] = useState('');
    const [prediction, setPrediction] = useState([]);
    const [loading, setLoading] = useState(false)
    const loadImage = async () => {
        setLoading(true)
        const model = await cocoSsd.load();
        const predictions = await model.detect(img.current);
        setPrediction(predictions);
        setLoading(false)
    }
    const handleInputChange = (e) => {
        let file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = _handleReaderLoaded
            reader.readAsDataURL(file)
        }
    }

    const _handleReaderLoaded = (readerEvt) => {
        let binaryString = readerEvt.target.result;
        setImgSrc(binaryString)
        setPrediction([])
    }

    return (
        <div className="App">
            <h1>Multiple object detection using pre trained model in TensorFlow.js</h1>

            <header className="note">
                <h2>Difficulty: Easy</h2>
            </header>

            <h2>How to use</h2>
            <section id="demos" className="invisible">
                <h2>Demo: Classifying Images</h2>
                <p>Select Image from your computer an then click on get prediction button to get predictions for the
                    image.</p>
                <div>
                    <input type="file" name="upload" onChange={(e) => handleInputChange(e)}/>
                    <div className="classifyOnClick">
                        {prediction.length > 0 && prediction.map((predict, index) => (
                            <div key={index}>
                                <p style={{'left': predict.bbox[0], 'top': predict.bbox[1]}}>{predict.class} - with
                                    {Math.round(parseFloat(predict.score) * 100)}
                                    % confidence.</p>
                                <div className="highlighter" style={{
                                    'left': predict.bbox[0],
                                    'top': predict.bbox[1],
                                    'height': predict.bbox[3],
                                    'width': predict.bbox[2]
                                }}></div>
                            </div>
                        ))}
                        <img src={imgsrc} alt="img" height={400} ref={img}/>
                    </div>
                </div>
                {imgsrc !== '' &&
                    <>
                        {loading ? <div className="lds-ellipsis">
                                <div></div>
                                <div></div>
                                <div></div>
                                <div></div>
                            </div> :
                            <div className="classifyOnCli" onClick={() => loadImage()}>
                                <button className="check"> Get Predictions</button>
                            </div>
                        }
                    </>

                }
            </section>

        </div>
    );
}

export default App;
