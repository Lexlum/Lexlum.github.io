# Image Sources

These images are downloaded locally from Unsplash image CDN and used as editorial/visual material for this personal website prototype.

- circuit-board.jpg
  - Source image URL: https://images.unsplash.com/photo-1518770660439-4636190af475
  - Use: supporting model training visual
- ai-chip.jpg
  - Source page URL: https://unsplash.com/photos/w69Z8K-HGQU
  - Download URL: https://unsplash.com/photos/w69Z8K-HGQU/download?force=true&w=2400
  - Use: hero and section texture for AI systems visual
- server-racks.jpg
  - Source image URL: https://images.unsplash.com/photo-1558494949-ef010cbdcc31
  - Use: distributed training / data center visual
- car-interior.jpg
  - Source image URL: https://images.unsplash.com/photo-1558618666-fcd25c85cd64
  - Use: automotive product landing visual
- climbing.jpg
  - Source image URL: https://images.unsplash.com/photo-1522163182402-834f871fd851
  - Use: off-track hobbies visual

## School, Company, And Paper Backgrounds

These images were added for sections that explicitly mention the user's school, company, or publications.

- nuist-campus.jpg
  - Source page URL: https://www.nuist.edu.cn/
  - Source image URL: https://www.nuist.edu.cn/__local/0/22/BC/425814FBEC40363DA1F15C10BB8_8C9BAFCA_62E94.jpg
  - Use: Nanjing University of Information Science & Technology / education background
- aispeech-company.jpg
  - Source page URL: https://www.aispeech.com/about/introduction
  - Source image URL: https://www.aispeech.com/imgs/company/banner.png
  - Use: AISpeech company background for career and project sections
- aispeech-technology.jpg
  - Source page URL: https://www.aispeech.com/
  - Source image URL: https://www.aispeech.com/imgs/index/banner.jpg
  - Use: AISpeech technology background for company/project cards
- research-library.jpg
  - Source page URL: https://unsplash.com/s/photos/library-research
  - Source image URL: https://images.unsplash.com/photo-1524995997946-a1c2e315a42f
  - Use: publication section and paper card background
- research-books.jpg
  - Source page URL: https://unsplash.com/s/photos/research-books
  - Source image URL: https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8
  - Use: paper trail / research context background

## Paper Thumbnails

The paper thumbnails are local screenshots or local visual cards for the publication list. They are used as compact previews inside individual paper cards.

- papers/kgcdp.jpg
  - Source page URL: https://dblp.org/rec/journals/kbs/RongSMJS24.html
  - Link target: https://doi.org/10.1016/j.knosys.2023.111297
- papers/debias.jpg
  - Source page URL: https://c.wanfangdata.com.cn/magazine/jsjkxyts/?isSync=0&issueNum=12&page=1&publishYear=2024&tabId=article
  - Link target: Google search for the paper title
- papers/kg2text.jpg
  - Source page URL: https://c.wanfangdata.com.cn/magazine/jsjkx?isSync=0&issueNum=3&page=1&publishYear=2023&tabId=article
  - Link target: Google search for the paper title
- papers/neurips-sparsity.jpg
  - Source page URL: https://proceedings.neurips.cc/paper_files/paper/2024/hash/c573258c38d0a3919d8c1364053c45df-Abstract-Conference.html
- papers/moe-svd.jpg
  - Source page URL: https://repository.hkust.edu.hk/ir/Record/1783.1-167186
- papers/bayeskd.jpg
  - Source page URL: https://aclanthology.org/2025.findings-acl.7/
- papers/delta-decompression.jpg
  - Source page URL: https://openreview.net/forum?id=ziezViPoN1
- papers/rta.jpg
  - Source page URL: https://dblp.org/rec/journals/ijon/ZhuMSRBH25.html
  - Link target: https://doi.org/10.1016/j.neucom.2024.128994
- papers/emotional-support.jpg
  - Source: local visual card derived from research-library.jpg because the journal page redirected to a validation-code page during automated capture
  - Link target: Google search for the paper title

## Resume Avatar And Local Composite Layers

The following assets are derived from the user's resume avatar and existing project images. The current Codex thread did not expose the built-in `image_gen` tool, so these were created as local editorial composites rather than model-generated image outputs.

- sun-shengjie-avatar.jpg
  - Source: extracted embedded JPEG from `孙圣杰-自然语言处理算法 (1).pdf`
  - Use: identity source image
- sun-portrait-layer.png
  - Source: resume avatar + circuit-board.jpg
  - Use: layered hero portrait panel
- sun-hero-speed-bg.jpg
  - Source: server-racks.jpg + car-interior.jpg + ai-chip.jpg
  - Use: Lando-inspired speed / compute hero background
- sun-tech-detail-layer.jpg
  - Source: resume avatar + ai-chip.jpg
  - Use: technical detail photo layer
- sun-avatar-lab-panel.jpg
  - Source: resume avatar + server-racks.jpg
  - Use: story mosaic identity panel

## Cyber Drift Placeholder

The following assets are local animated composites created from the resume avatar plus existing site imagery. They are intended as a preview placeholder for the requested `image2` / identity-preserving generation, which is blocked in this thread because no built-in image generation tool is exposed and `OPENAI_API_KEY` is not present.

- cyber-drift-driver-poster.jpg
  - Source: resume avatar + car-interior.jpg + ai-chip.jpg + neural-track.png
  - Use: poster frame for cyberpunk drift driving hero video
- ../video/cyber-drift-driver.mp4
  - Source: locally generated 96-frame animation from the same assets
  - Use: desktop hero video
- ../video/cyber-drift-driver.webm
  - Source: locally generated 96-frame animation from the same assets
  - Use: desktop hero video fallback
- ../../prompts/cyberpunk-drift-driver-image2-prompt.txt
  - Use: ready-to-run prompt for a true identity-preserving image model generation pass

## GPT Image 2 Outputs

- cyber-drift-driver-image2-v4-helmet-side.png
  - Source: GPT Image 2 edit using `sun-shengjie-avatar.jpg` and `car-interior.jpg`
  - Use: default helmet hero state
- cyber-drift-driver-image2-v5-no-helmet-inpaint.png
  - Source: GPT Image 2 masked edit from `cyber-drift-driver-image2-v4-helmet-side.png` using `sun-shengjie-avatar.jpg`
  - Use: hover no-helmet hero state aligned to the same composition
- cyber-drift-driver-helmet-remove-mask-openai.png
  - Source: local alpha mask for the v5 masked edit
  - Use: editable helmet/head region only
- ../../prompts/cyberpunk-drift-driver-image2-v4-helmet-side.txt
  - Use: side-profile helmet prompt
- ../../prompts/cyberpunk-drift-driver-image2-v5-no-helmet-inpaint.txt
  - Use: same-composition no-helmet masked-edit prompt
