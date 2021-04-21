import { createRef, useState } from "react";
import styles from "./style.module.css"
import Script from "./script"
import loader from "./Spinner-1s-200px.gif"
function MainPage(props) {
    let inputFile=createRef()
    const [isLoading,setIsLoading]=useState(false),[files,setFiles]=useState([]);
    let [Percentages,setPercentages]=useState("0")
    function SendData(e,rout) {
      e.preventDefault();
      setIsLoading(true)
      let formData = new FormData();
      Object.values(inputFile.files).forEach((value)=>{formData.append("file",value)})
      formData.append("workType",document.forms[0].elements[4].value)
      formData.append("lang",document.forms[0].elements[5].value)
      fetch(rout, {method: 'POST',body: formData})
        .then((response)=>response.json())
        .then((res)=>{
          setIsLoading(false)
          setPercentages(`${res.result ||Percentages}`.slice(0,5))
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
            <form  id='uploadForm' encType="multipart/form-data">
            <input type="file" name="foo" ref={element=>inputFile=element} onChange={()=>Script.ShowNames(inputFile,setFiles)}></input>
            {files.length>0 &&<>
            <h3>Выбранные файлы</h3>
            <ul>
                {files}
            </ul>
                 <input type='submit' value='Провеpить на плагиат(алгоритм Вагнера-Фишера)' onClick={(e)=>M1(e)} />
                 <input type='submit' value='Провеpить на плагиат(алгоритм Шинглов)' onClick={(e)=>M2(e)}/>
                 <input type='submit' value='Добавить в базу данных' onClick={(e)=>M3(e)}/>
                 <input type="text" placeholder="Выберите вид работы" /> 
                 <input type="text" placeholder="Выберите язык" /> 
                 {isLoading?<div className={styles.modalLoader}><img src={loader} alt='loader'/></div>:<h1>Файлы в среднем 
                 похожи на {Percentages}%</h1>}
            </>
            }
            </form>
        </div>
    )
}
export default MainPage;