// import type { User } from "@clerk/nextjs/dist/api";
import { auth } from "@clerk/nextjs";
import { User, clerkClient } from "@clerk/nextjs/server";
import { TRPCError } from "@trpc/server";
import { map } from "@trpc/server/observable";
import { z } from "zod";

import { createTRPCRouter, privateProcedure, publicProcedure } from "~/server/api/trpc";
import type { Post } from "@prisma/client"

const filterUserForClient = (user: User) => {
  return {
    id: user.id,
    // username: user.username,
    username: "TessaPugh",
    profileImageUrl: user.profileImageUrl,
  }
}

export const postsRouter = createTRPCRouter({
  getAll: publicProcedure.query(async ({ ctx }) => {
    const posts = await ctx.db.post.findMany({
      take: 100,
      orderBy: [{createdAt: "desc"}]
    });

    const users = (
      await clerkClient.users.getUserList({
        userId: posts.map((post) => post.authorId),
        limit: 100,
      })
    ).map(filterUserForClient)

    console.log(users)

    return posts.map((post) => {
      const author = users.find((user) => user.id === post.authorId)
      if (!author || !author.username) 
        throw new TRPCError({ 
          code: "INTERNAL_SERVER_ERROR",
          message: "Author for post not found",
        })
      
      return {
        post, 
        author,
      };
    });
  }),

  create: privateProcedure
    .input(
      z.object({
        content: z.string().min(1).max(280)
      })
    )
    .mutation(async ({ ctx, input }) => {
      const authorId = ctx.userId
      
      const post = await ctx.db.post.create({
        data:  {
          authorId,
          content: input.content
        }
      })

    return post
  }) 
});
