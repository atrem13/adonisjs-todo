// import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Todo from 'App/Models/Todo'

export default class TodosController {
    public async index({view, request}){
        const todos = await Todo.query().preload('user')
        return view.render('dashboard', {todos})
    }

    public async byUserId({view, auth, request}){
        const user = await auth.authenticate()
        await user.preload('todos')
        const todos = user.todos

        return view.render('dashboard', {todos})
    }
    public async show({view, request, params})
    {
        try {
            const todo = await Todo.find(params.id);
            
            await todo.preload('user')
            return view.render('show', {todo});
        } catch (error) {
            console.log(error)
        }
        
    }
    public async edit({view, request, params})
    {
        const todo = await Todo.find(params.id);
        await todo.preload('user')
        return view.render('edit', {todo});
    }

    public async update({view, auth, request, params})
    {
        const todo = await Todo.find(params.id);
        if (todo) {
            todo.title = request.input('title');
            todo.description = request.input('description');
            todo.status = request.input('status') == 'on' ? 1 : 0;
            if (await todo.save()) {
                await todo.preload('user')
                return view.render('show', {todo});
            }
            return; // 422
        }
        return; // 401
    }
    public async create({view, request})
    {
        return view.render('add');
    }
    public async store({view, auth, request, response})
    {
        const user = await auth.authenticate();
        const todo = new Todo();
        todo.title = request.input('title');
        todo.description = request.input('description');
        await user.related('todos').save(todo)
        response.redirect('/todos/'+todo.id);
    }
    public async destroy({response, auth, request, params})
    {
       const user = await auth.authenticate();
       const todo = await Todo.query().where('user_id', user.id).where('id', params.id).delete();
       return response.redirect('/dashboard');
    }
}
