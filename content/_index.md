---
title: 'Home'
date: 2023-10-24
type: landing

sections:
  # A section to display blog posts

  - block: markdown
    content:
      text: "# Le Blog de la datascience en santé"
    design:
      background:
        gradient_start: '#0F2027'
        gradient_end: '#2C5364'
        gradient_angle: 180
        text_color_light: true
  
  - block: collection
    id: posts
    content:
      # Display content from the `content/post/` folder
      filters:
        folders:
          - posts
    design:
      # Choose how many columns the section has. Valid values: '1' or '2'.
      view: article-grid
      text_color_light: false
      # Choose your content listing view - here we use the `showcase` view
      columns: '1'
      # For the Showcase view, do you want to flip alternate rows?
      flip_alt_rows: true

      spacing:
        padding: ['0px', '0px', '0px', '0px']


---
