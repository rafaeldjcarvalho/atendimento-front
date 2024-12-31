import {
  Directive,
  Input,
  OnInit,
  OnDestroy,
  TemplateRef,
  ViewContainerRef,
} from '@angular/core';
import { Subscription } from 'rxjs';
import { Access } from '../../types/access.type';
import { AuthService } from '../../services/auth.service';


@Directive({
  standalone: true, // Define como standalone
  selector: '[showForAccess]',
})
export class ShowForAccessDirective implements OnInit, OnDestroy {
  @Input('showForAccess') allowedAccess?: Access[]; // Tipos de acesso permitidos
  private sub?: Subscription;

  constructor(
    private authService: AuthService,
    private viewContainerRef: ViewContainerRef,
    private templateRef: TemplateRef<any>
  ) {}

  ngOnInit(): void {
    this.sub = this.authService.user$.subscribe((user) => {
      if (user && this.allowedAccess?.includes(user.access)) {
        this.viewContainerRef.createEmbeddedView(this.templateRef);
      } else {
        this.viewContainerRef.clear();
      }
    });
  }

  ngOnDestroy(): void {
    this.sub?.unsubscribe();
  }
}


