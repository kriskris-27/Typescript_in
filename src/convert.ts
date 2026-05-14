const args = process.argv.slice(2)

const numstr = args[0]
const fm = args[1]
const to = args[2]

if (numstr === undefined || fm === undefined || to === undefined) {
    console.error("Provide three values")
    process.exit(1)
}

const num:number = parseInt(numstr, 10)
const frm = fm.toLowerCase()
const too = to.toLowerCase()

if(frm === "c" && too === "f"){
    console.log((num * 9/5) +32)
}
else if(frm === "f" && too === "c"){
    console.log((num - 32) * 5 / 9)
}
else {
    console.error("provide a valid input")
    process.exit(1)
}