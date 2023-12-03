import './main/config/module-alias'
import { Person } from '@/api/controller/personController'

const person = new Person()
person.speak()
person.speak('Raul')
