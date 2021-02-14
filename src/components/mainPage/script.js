
function ShowNames(element, setFiles) {
    let liElements = []
    const Files = Object.values(element.files);
    Files.forEach((value, index) => {
        liElements.push(<li key={index}>{value.name}</li>)
    })
    setFiles(liElements)
}
export default { ShowNames: ShowNames}
