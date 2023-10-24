/**
 * @template { Object | Object[] } T 
 * @param { any } obj 
 * @param { ElementType<T> } example as T or element of T
 * @returns { boolean }
 */
export function isOfType<T extends Object | Object[]>(obj: any, example: ElementType<T>): boolean {
  // Si pas d'objet on return false
  if(!obj) return false;
  
  // On récupère la liste des clefs de l'objet example
  const expectedKeys = Object.keys(example);

  // Si la réponse API est un array on compare les clefs de son premier élément avec l'exemple
  if(Array.isArray(obj) && obj.length > 0) {
    return expectedKeys.every(key => key in obj[0]);
  } 

  // Si la réponse API n'est pas un array et est un object on compare ses clefs avec l'exemple
  if(!Array.isArray(obj) && typeof obj === 'object') {
    return expectedKeys.every(key => key in obj)
  }

  return false
}