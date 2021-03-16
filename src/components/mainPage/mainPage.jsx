import { createRef, useState } from "react";
import styles from "./style.module.css"
import Script from "./script"
import loader from "./Spinner-1s-200px.gif"
function MainPage(props) {
    let inputFile=createRef();
    let Forma=createRef();
    const [isLoading,setIsLoading]=useState(false)
    const [files,setFiles]=useState([]);
    let [Percentages,setPercentages]=useState("0")
    function SendData(e,rout) {
      e.preventDefault();
      setIsLoading(true)
      let formData = new FormData();
      Object.values(inputFile.files).forEach((value)=>{formData.append("file",value)})
      fetch(rout, {
          method: 'POST',
          body: formData
        }).then(function (response) {
          return response.json()
        }).then((res)=>{
          setIsLoading(false)
          setPercentages(`${res.result}`.slice(0,5))
        })
    }
    function M1(e) {
      SendData(e,"/checkFileM1")
    }
    function M2(e) {
      SendData(e,"/checkFileM2")
    }
    function M3(e) {
      SendData(e,"/logdata")
    }
    return(
        <div className={styles.Container}>
            <h1>MainPage</h1>
            <form  id='uploadForm' ref={(el)=>Forma=el} encType="multipart/form-data">
            <input type="file" name="foo" multiple ref={element=>inputFile=element} onChange={()=>Script.ShowNames(inputFile,setFiles)}></input>
            {files.length>0 &&<>
            <h3>Выбранные файлы</h3>
            <ul>
                {files}
            </ul>
                 <input type='submit' value='Провеpить на плагиат(алгоритм Вагнера-Фишера)' onClick={(e)=>M1(e)} />
                 <input type='submit' value='Провеpить на плагиат(алгоритм Шинглов)' onClick={(e)=>M2(e)}/>
                 <input type='submit' value='Добавить в базу данных' onClick={(e)=>M3(e)}/>
                 {isLoading?<div className={styles.modalLoader}><img src={loader} alt='loader'/></div>:<h1>Файлы в среднем 
                 похожи на {Percentages}%</h1>}
            </>
            }
            </form>
        </div>
    )
}
export default MainPage;