/* Consigna: Implementar programa que contenga una clase llamada Contenedor que reciba el nombre del archivo con el que va a trabajar e implemente los siguientes métodos:

save(Object): Number - Recibe un objeto, lo guarda en el archivo, devuelve el id asignado.
getById(Number): Object - Recibe un id y devuelve el objeto con ese id, o null si no está.
getAll(): Object[] - Devuelve un array con los objetos presentes en el archivo.
deleteById(Number): void - Elimina del archivo el objeto con el id buscado.
deleteAll(): void - Elimina todos los objetos presentes en el archivo.

*/

const fs = require ('fs')


class Contenedor {

  constructor( file ) {
      this.file = file
  }

  
  async getAll() {
    try{
      const objects = await fs.promises.readFile( this.file, 'utf-8')
      return JSON.parse(objects)

    } catch(err) {
      console.log(`Se produjo el siguiente error: ${err}`)
    }
  }
 
  
  async saveFile ( file, objects ) {
    try {
      await fs.promises.writeFile(
        file, JSON.stringify( objects, null, 2 )
        )
    } catch(err) {
      console.log(`Se produjo el siguiente error: ${err}`)
    }
  }


  async save( object ) {
    const objects = await this.getAll()
    try{
        let idNew
        objects.length === 0 
          ? idNew = 1
          : idNew = objects[ objects.length - 1 ].id + 1
        
        const objectNew = { id: idNew, ...object }       
        objects.push(objectNew)        
        await this.saveFile(this.file, objects)
        return idNew

    } catch(err) {
      console.log(`Se produjo el siguiente error: ${err}`)
    }
  }


  async getById( id ) {
    const objects = await this.getAll()
    try {
      const object = objects.find( ele => ele.id === id)
      return object ? object : null

    } catch(err) {
      console.log(`Se produjo el siguiente error: ${err}`)
    }
  }


  async deleteById( id ) {
    let objects = await this.getAll()
    
    try {
      objects = objects.filter( ele => ele.id != id )
      await this.saveFile( this.file, objects)
    
    } catch(err) {
      console.log(`Se produjo el siguiente error: ${err}`)
    }
  }


  async deleteAll() {
    await this.saveFile(this.file, [])
  }

}



/*script */

const productos = new Contenedor('productos.txt')

const prueba = async() => {
  try {
    
    /*prueba getAll*/
    let array = await productos.getAll()
    console.log(array)


    /*prueba save*/
    await productos.save(
      { "title": "producto4",
        "price": 123,
        "thumbnail": "url4"
      }
    )
    array = await productos.getAll()
    console.log(array)


    /*prueba getById*/
    let idResp = await productos.getById(0)
    console.log(idResp)
    idResp = await productos.getById(2)
    console.log(idResp)

    
    /*prueba deleteById*/
    await productos.deleteById(2)
    array = await productos.getAll()
    console.log(array)


    /*prueba deleteAll*/
    await productos.deleteAll()
    array = await productos.getAll()
    console.log(array)


  } catch(err) {
    console.log(err)
  }
}




prueba()