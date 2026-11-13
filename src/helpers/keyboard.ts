/**
 * Nombre con el que se guarda una tecla en `config.keyboardCommands`: `e.key` salvo la barra
 * espaciadora, que es " " y se guarda como "Space" (se ve en el selector de atajos).
 * Para comparar un KeyboardEvent con un atajo: `toCommandKey(e.key) === atajo`
 */
export const toCommandKey = (key: string) => (key === " " ? "Space" : key);
