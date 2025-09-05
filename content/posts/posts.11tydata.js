export default {
	tags: ["posts"],
	layout: "layouts/post.njk",
	permalink: "{{ page.date | readableDate('yyyy/MM/dd') }}/{{ page.fileSlug }}/index.html",
	eleventyComputed: {
		title: (data) => data.title || data.page.fileSlug.replace(/-/g, " ").replace(/\b\w/g, (l) => l.toUpperCase()),
		redirect_from: function (data) {
			if (data.page.date.getFullYear() > 2021) {
				// no redirects for new posts
				return null;
			}
			return this.readableDate(data.page.date, "yyyy/MM/dd") + "/" + data.page.fileSlug + ".html";
		},
	},
};
