import { PitchPreset } from './types';

export const PITCH_PRESETS: PitchPreset[] = [
  {
    id: 'founding-engineer',
    name: 'Founding Engineer Pitch',
    tagline: 'High ownership, speed & 0-to-1 execution. Best for early-stage & Seed/Series A.',
    wordCountTarget: 95,
    subjectTemplate: '{{role}} @ {{company}} — {{candidate_name}} (built {{highlight_project}})',
    bodyTemplate: `Hi {{first_name}},

Saw {{company}}'s recent push into {{recent_milestone}} — love what you're building.

I'm an engineer who focuses on shipping 0-to-1 systems with high autonomy. Recently, I built {{highlight_project}} ({{project_metric}}), working across {{tech_stack}}.

For the {{role}} opening, I'd love to help your team execute faster on core product infrastructure and scale with zero hand-holding.

Code & portfolio: {{portfolio_url}} | GitHub: {{github_url}}

Open to a brief 10-minute intro chat this Thursday or Friday?

Best,
{{candidate_name}}`
  },
  {
    id: 'minimal-builder',
    name: 'Minimal Builder (< 75 words)',
    tagline: 'Ultra-concise, pure signal. Perfect for busy technical founders & CTOs.',
    wordCountTarget: 68,
    subjectTemplate: '{{role}} / {{candidate_name}}',
    bodyTemplate: `Hey {{first_name}},

Quick note — huge fan of {{company}}. 

I'm a builder specialized in {{top_skills}}. Most recently, I shipped {{highlight_project}} which handles {{project_metric}}. 

I'd love to jump in on {{company}}'s {{role}} role and start pushing PRs on day one.

You can inspect my work here:
• Portfolio: {{portfolio_url}}
• GitHub: {{github_url}}

Would 10 mins this week work for a quick sync?

Cheers,
{{candidate_name}}`
  },
  {
    id: 'problem-teardown',
    name: 'Value-First / Teardown Pitch',
    tagline: 'Offers a specific technical insight or angle. Shows deep preparation.',
    wordCountTarget: 110,
    subjectTemplate: 'Idea for {{company}} + quick intro ({{role}})',
    bodyTemplate: `Hi {{first_name}},

Was recently testing {{company}} and noticed how smoothly your team handled {{recent_milestone}}. 

Given your focus on scaling, I saw an opportunity around optimizing {{key_focus_area}} to make the developer experience even faster. When building {{highlight_project}}, we solved a similar bottleneck by {{project_description}} (achieving {{project_metric}}).

I'm exploring {{role}} opportunities where I can take high technical ownership and ship production features immediately.

Portfolio: {{portfolio_url}}
GitHub: {{github_url}}

If you have 10 minutes, I'd love to share a few quick notes on this. Either way, cheering on {{company}}!

Best,
{{candidate_name}}`
  },
  {
    id: 'product-growth',
    name: 'Product-Minded Engineer',
    tagline: 'Balances deep technical chops with strong design sensibility and user obsession.',
    wordCountTarget: 98,
    subjectTemplate: '{{candidate_name}} for {{role}} at {{company}}',
    bodyTemplate: `Hey {{first_name}},

Congrats on {{recent_milestone}}! 

I'm a full-stack engineer who cares deeply about polish, craft, and fast iteration loops. I recently built {{highlight_project}}, combining {{tech_stack}} to deliver {{project_metric}}.

I'm reaching out because I want to work with a lean, ambitious team building {{company_description}}. I can bridge high-throughput engineering with clean product UX for the {{role}} position.

A few things I've built:
• Projects: {{portfolio_url}}
• Open Source: {{github_url}}

Do you have 10 mins for a quick intro this week?

Thanks,
{{candidate_name}}`
  }
];
