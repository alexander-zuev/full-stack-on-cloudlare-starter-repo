import {Hono} from 'hono';
import {getLink} from '@repo/data-ops/queries/links'
import {cloudflareInfoSchema} from '@repo/data-ops/zod-schema/links'
import {getDestinationForCountry} from "@/helpers/route-ops";

export const App = new Hono<{Bindings: Env}>();

// Build routes

App.get('/', async (c) => {
	console.log(JSON.stringify(c.req.raw.cf))
	return c.json({
		message: "Hello world"
	})
})
App.get('/:id', async (c) =>{
	const {id} = c.req.param()
	const linkInfo = await getLink(id)

	if(!linkInfo){
		return c.text('Destination not found', 404)
	}

	const cfHeader = cloudflareInfoSchema.safeParse(linkInfo)
	if(!cfHeader.success){
		return c.text('Invalid Cloudflare headers', 404)
	}

	const headers = cfHeader.data
	console.log(headers)

	const destination = getDestinationForCountry(linkInfo, headers.country)
	return c.redirect(destination)
})
