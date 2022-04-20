// import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import User from 'App/Models/User'
import {schema, rules} from '@ioc:Adonis/Core/Validator'

export default class AuthController {
    public async register({request, response}){
        const validationSchema = schema.create({
            email: schema.string({trim: true}, [
                rules.email(),
                rules.unique({table: "users", column: "email"}),
            ]),
            password: schema.string({trim: true}, [
                rules.confirmed()
            ]),
        })

        const userDetails = await request.validate({
            schema: validationSchema,
        })

        const user = new User()
        user.email = userDetails.email
        user.password = userDetails.password

        await user.save()
        await auth.login(user);

        response.redirect('/dashboard')
    }

    public async login({auth, request, response}){
        const email = request.input('email')
        const password = request.input('password')

        await auth.attempt(email, password);
        response.redirect('/dashboard')
    } 
}
