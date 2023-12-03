export class Person {
  speak(name?: string) {
    console.log(`Ola ${name ?? 'fulano'}` )
  }
}
