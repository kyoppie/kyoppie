kyoppie-post.post(data-user-screen-name="{opts.post.user.screenName}", data-user-name="{opts.post.user.name}", data-is-repost="{opts.post.original ? 1 : 0}")
    .post-repostUser(if="{opts.post.original}")
        a(href="/u/{opts.post.original.user.screenName}")
            | {opts.post.original.user.name}
            img.post-user-icon(src="{opts.post.original.user.avatarThumbnailUrl}",alt="@{opts.post.original.user.screenName}", title="@{opts.post.original.user.screenName}")
            a(href="/u/{opts.post.original.user.screenName}")
                i.fa.fa-check-circle(title="本人確認済みマーク", if="{opts.post.original.user.isVerified}")
            small @{opts.post.original.user.screenName}
            | さんがRePost
    .post-replyTo(if="{opts.post.replyTo}")
        a(href="/u/{opts.post.replyTo.user.screenName}")
            img.post-user-icon(src="{opts.post.replyTo.user.avatarThumbnailUrl}",alt="@{opts.post.replyTo.user.screenName}",title="@{opts.post.replyTo.user.screenName}")
        .post-user
            a(href="/u/{opts.post.replyTo.user.screenName}") {opts.post.replyTo.user.name}
                i.fa.fa-check-circle(title="本人確認済みマーク",if="{opts.post.replyTo.user.isVerified}")
            small @{opts.post.replyTo.user.screenName}
        a(href="/p/{opts.post.replyTo.id}",title="{opts.post.replyTo.user.name}@{opts.post.replyTo.user.screenName}さんの投稿 - “{opts.post.replyTo.text}” -kyoppie")
            time.relative_time(datetime="{opts.post.replyTo.createdAt}",title="{opts.post.replyTo.createdAt}") {opts.post.createdAt}
        .post-text: kyoppie-text-render.post-text(text="{opts.post.replyTo.text}")
    a(href="/u/{opts.post.user.screenName}")
        img.post-user-icon(src="{opts.post.user.avatarThumbnailUrl}",alt="@{opts.post.user.screenName}",title="@{opts.post.user.screenName}")
    .post-user
        a(href="/u/{opts.post.user.screenName}") {opts.post.user.name}
            i.fa.fa-check-circle(title="本人確認済みマーク", if="{opts.post.user.isVerified}")
        small @{opts.post.user.screenName}
    a(href="/p/{opts.post.id}",title="{opts.post.user.name}@{opts.post.user.screenName}さんの投稿 - “{opts.post.text}” -kyoppie"): time.relative_time(datetime="{opts.post.createdAt}",title="{opts.post.createdAt}") {opts.post.createdAt}
    .post-text: kyoppie-text-render(text="{opts.post.text}")
    .post-files
        virtual(each="{file in opts.post.files}")
            a(href="{file.url}",target="_blank",if="{file.type == 'image'}")
                img(src="{file.thumbnailUrl}")
            video(src="{file.url}",controls,preload="metadata",poster="{file.thumbnailUrl}",if="{file.type == 'video'}")
    .post-actions
        button.post-reply(data-post-id="{opts.post.id}"): i.fa.fa-reply
        span.post-count
        button.post-repost(class="{post-reposted:opts.post.isReposted}",data-post-id="{opts.post.id}"): i.fa.fa-retweet
        span.post-count {opts.post.repostCount}
        button.post-favorite(class="{post-favorited:opts.post.isFavorited}",data-post-id="{opts.post.id}"): i.fa(class="{fa-star-o:!opts.post.isFavorited, fa-star:opts.post.isFavorited}")
        span.post-count {opts.post.favoriteCount}
